export interface AdministrativeUnit {
  id: string;
  stateCode: string; // 'AP', 'TS', 'MH'
  areaType: 'RURAL' | 'URBAN';
  district: string;
  subDivision?: string;
  mandalOrTehsilOrMunicipality: string;
  villageOrWard: string;
}

export const GEOGRAPHY_MASTER: AdministrativeUnit[] = [
  // Telangana - Rural (Ranga Reddy -> Ibrahimpatnam Mandal -> Pocharam Village)
  { id: 'TS-RR-IBR-01', stateCode: 'TS', areaType: 'RURAL', district: 'Ranga Reddy', mandalOrTehsilOrMunicipality: 'Ibrahimpatnam', villageOrWard: 'Pocharam' },
  { id: 'TS-RR-IBR-02', stateCode: 'TS', areaType: 'RURAL', district: 'Ranga Reddy', mandalOrTehsilOrMunicipality: 'Ibrahimpatnam', villageOrWard: 'Khanapur' },
  // Telangana - Urban (Hyderabad -> GHMC -> Circle 10 -> Banjara Hills Ward 93)
  { id: 'TS-HYD-GHMC-01', stateCode: 'TS', areaType: 'URBAN', district: 'Hyderabad', mandalOrTehsilOrMunicipality: 'GHMC Khairatabad', villageOrWard: 'Ward 93 (Banjara Hills)' },
  { id: 'TS-HYD-GHMC-02', stateCode: 'TS', areaType: 'URBAN', district: 'Hyderabad', mandalOrTehsilOrMunicipality: 'GHMC Charminar', villageOrWard: 'Ward 45 (Charminar)' },

  // Andhra Pradesh - Rural (Krishna -> Machilipatnam Mandal -> Chilakalapudi)
  { id: 'AP-KRI-MCP-01', stateCode: 'AP', areaType: 'RURAL', district: 'Krishna', mandalOrTehsilOrMunicipality: 'Machilipatnam', villageOrWard: 'Chilakalapudi' },
  { id: 'AP-KRI-MCP-02', stateCode: 'AP', areaType: 'RURAL', district: 'Krishna', mandalOrTehsilOrMunicipality: 'Machilipatnam', villageOrWard: 'Guduru' },
  // Andhra Pradesh - Urban (NTR District -> Vijayawada Municipal Corp -> Ward 12 Governorpet)
  { id: 'AP-VMC-URB-01', stateCode: 'AP', areaType: 'URBAN', district: 'NTR District', mandalOrTehsilOrMunicipality: 'Vijayawada Municipal Corp', villageOrWard: 'Ward 12 (Governorpet)' },

  // Maharashtra - Rural (Pune -> Haveli Taluka -> Wagholi)
  { id: 'MH-PUN-HAV-01', stateCode: 'MH', areaType: 'RURAL', district: 'Pune', mandalOrTehsilOrMunicipality: 'Haveli Taluka', villageOrWard: 'Wagholi' },
  // Maharashtra - Urban (Mumbai Suburban -> MCGM K-West Ward -> Andheri West)
  { id: 'MH-MUM-MCGM-01', stateCode: 'MH', areaType: 'URBAN', district: 'Mumbai Suburban', mandalOrTehsilOrMunicipality: 'MCGM K-West', villageOrWard: 'Andheri West' },
];
