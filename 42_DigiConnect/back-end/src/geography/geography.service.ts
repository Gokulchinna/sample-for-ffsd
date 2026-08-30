import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { db } from '../data/store';
import {
  JurisdictionNode,
  JurisdictionTreeNode,
} from '../models/jurisdiction.model';
import { TierLevel } from '../models/enums';
import { CreateNodeDto, UpdateNodeDto } from './dto/create-node.dto';

@Injectable()
export class GeographyService {
  /**
   * Get direct children of a parent node, optionally filtered by state.
   */
  getChildren(
    parentId: string | null = null,
    stateId?: string,
  ): JurisdictionNode[] {
    return db.jurisdictionNodes.filter((node) => {
      const matchState = !stateId || node.stateId === stateId;
      const matchParent = parentId === null ? node.parentId === null : node.parentId === parentId;
      return matchState && matchParent;
    });
  }

  /**
   * Fetch a specific node by ID.
   */
  getNodeById(id: string): JurisdictionNode {
    const node = db.jurisdictionNodes.find((n) => n.id === id);
    if (!node) {
      throw new NotFoundException(`Jurisdiction node '${id}' not found.`);
    }
    return node;
  }

  /**
   * Get all ancestor nodes of a node, ordered from immediate parent upwards to root.
   */
  getAncestors(nodeId: string): JurisdictionNode[] {
    const ancestors: JurisdictionNode[] = [];
    let current = db.jurisdictionNodes.find((n) => n.id === nodeId);
    if (!current) return [];

    const visited = new Set<string>([current.id]);
    while (current && current.parentId) {
      if (visited.has(current.parentId)) {
        break; // Cycle prevention
      }
      const parent = db.jurisdictionNodes.find((n) => n.id === current!.parentId);
      if (!parent) break;
      ancestors.push(parent);
      visited.add(parent.id);
      current = parent;
    }
    return ancestors;
  }

  /**
   * Traverse up the tree to find an ancestor with a specific tier level.
   */
  findParentNodeByLevel(
    startNodeId: string,
    targetTier: TierLevel,
  ): JurisdictionNode | null {
    const node = db.jurisdictionNodes.find((n) => n.id === startNodeId);
    if (!node) return null;
    if (node.tierLevel === targetTier) return node;

    const ancestors = this.getAncestors(startNodeId);
    return ancestors.find((a) => a.tierLevel === targetTier) || null;
  }

  /**
   * Master Scoping Logic: Determines if a citizen's leaf node falls under an officer's assigned node.
   * If assignedNodeId is District, it covers all child sub-divisions, mandals, municipalities, villages, wards!
   */
  isNodeWithinScope(leafNodeId: string, assignedNodeId: string): boolean {
    if (!leafNodeId || !assignedNodeId) return false;
    if (leafNodeId === assignedNodeId) return true;

    const ancestors = this.getAncestors(leafNodeId);
    return ancestors.some((a) => a.id === assignedNodeId);
  }

  /**
   * Build recursive tree of jurisdiction nodes for visual display.
   */
  buildTree(stateId?: string): JurisdictionTreeNode[] {
    const rootNodes = db.jurisdictionNodes.filter((node) => {
      const isRoot = node.parentId === null;
      return isRoot && (!stateId || node.stateId === stateId);
    });

    const populateChildren = (node: JurisdictionNode): JurisdictionTreeNode => {
      const children = db.jurisdictionNodes.filter(
        (child) => child.parentId === node.id,
      );
      return {
        ...node,
        children: children.map((c) => populateChildren(c)),
      };
    };

    return rootNodes.map((root) => populateChildren(root));
  }

  /**
   * Create a new jurisdiction node.
   */
  createNode(dto: CreateNodeDto): JurisdictionNode {
    // Check state existence
    const state = db.states.find((s) => s.id === dto.stateId);
    if (!state) {
      throw new NotFoundException(`State '${dto.stateId}' does not exist.`);
    }

    if (dto.parentId) {
      const parent = db.jurisdictionNodes.find((n) => n.id === dto.parentId);
      if (!parent) {
        throw new NotFoundException(`Parent node '${dto.parentId}' does not exist.`);
      }
      if (parent.stateId !== dto.stateId) {
        throw new BadRequestException(
          `Parent node '${dto.parentId}' belongs to state '${parent.stateId}', not '${dto.stateId}'.`,
        );
      }
    } else {
      if (dto.tierLevel !== 'STATE') {
        throw new BadRequestException(`Root node with null parentId must have tierLevel 'STATE'.`);
      }
    }

    // Check duplicate name under same parent
    const duplicate = db.jurisdictionNodes.find(
      (n) =>
        n.stateId === dto.stateId &&
        n.parentId === (dto.parentId || null) &&
        n.name.toLowerCase() === dto.name.trim().toLowerCase(),
    );
    if (duplicate) {
      throw new ConflictException(
        `A jurisdiction named '${dto.name}' already exists under the same parent.`,
      );
    }

    const newNode: JurisdictionNode = {
      id: `node_${Date.now().toString().slice(-6)}_${Math.random().toString(36).substr(2, 4)}`,
      stateId: dto.stateId,
      parentId: dto.parentId || null,
      name: dto.name.trim(),
      governanceType: dto.governanceType as any,
      tierLevel: dto.tierLevel as any,
      code: dto.code || dto.name.toUpperCase().replace(/\s+/g, '_').slice(0, 10),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.jurisdictionNodes.push(newNode);
    return newNode;
  }

  /**
   * Update jurisdiction node properties.
   */
  updateNode(id: string, dto: UpdateNodeDto): JurisdictionNode {
    const node = this.getNodeById(id);

    if (dto.name && dto.name.trim() !== node.name) {
      // Check duplicate
      const duplicate = db.jurisdictionNodes.find(
        (n) =>
          n.id !== id &&
          n.parentId === node.parentId &&
          n.name.toLowerCase() === dto.name!.trim().toLowerCase(),
      );
      if (duplicate) {
        throw new ConflictException(
          `Another jurisdiction named '${dto.name}' already exists under the same parent.`,
        );
      }
      node.name = dto.name.trim();
    }

    if (dto.governanceType) node.governanceType = dto.governanceType as any;
    if (dto.tierLevel) node.tierLevel = dto.tierLevel as any;
    node.updatedAt = new Date().toISOString();

    return node;
  }

  /**
   * Safe delete jurisdiction node. Fails if active child nodes exist.
   */
  deleteNode(id: string): { success: boolean; message: string } {
    const node = this.getNodeById(id);

    const hasChildren = db.jurisdictionNodes.some((n) => n.parentId === id);
    if (hasChildren) {
      throw new BadRequestException(
        `Cannot delete jurisdiction '${node.name}' because it contains active child jurisdictions. Delete descendants first.`,
      );
    }

    // Check if officers are mapped to this node
    const mappedOfficer = db.officers.find(
      (o) => o.assignedNodeId === id && o.status === 'Active',
    );
    if (mappedOfficer) {
      throw new BadRequestException(
        `Cannot delete jurisdiction '${node.name}' because active officer '${mappedOfficer.name}' is assigned to it.`,
      );
    }

    const index = db.jurisdictionNodes.findIndex((n) => n.id === id);
    if (index >= 0) {
      db.jurisdictionNodes.splice(index, 1);
    }

    return {
      success: true,
      message: `Jurisdiction node '${node.name}' (${id}) deleted successfully.`,
    };
  }
}
