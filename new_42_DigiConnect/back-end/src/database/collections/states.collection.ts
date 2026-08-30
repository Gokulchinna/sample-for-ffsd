export interface StateTenant {
  stateCode: string; // e.g. 'TS', 'AP', 'MH', 'UP'
  stateName: string; // e.g. 'Telangana', 'Andhra Pradesh'
  capital: string;
  portalTitle: string;
  isActive: boolean;
  supportedLanguages: string[];
}

export const STATES_MASTER: StateTenant[] = [
  { stateCode: 'AP', stateName: 'Andhra Pradesh', capital: 'Amaravati', portalTitle: 'MeeSeva DigiConnect AP', isActive: true, supportedLanguages: ['en', 'te'] },
  { stateCode: 'TS', stateName: 'Telangana', capital: 'Hyderabad', portalTitle: 'T-Seva DigiConnect Telangana', isActive: true, supportedLanguages: ['en', 'te'] },
  { stateCode: 'MH', stateName: 'Maharashtra', capital: 'Mumbai', portalTitle: 'MahaOnline DigiConnect', isActive: true, supportedLanguages: ['en', 'mr'] },
  { stateCode: 'UP', stateName: 'Uttar Pradesh', capital: 'Lucknow', portalTitle: 'eDistrict DigiConnect UP', isActive: true, supportedLanguages: ['en', 'hi'] },
  { stateCode: 'KA', stateName: 'Karnataka', capital: 'Bengaluru', portalTitle: 'Sakala DigiConnect Karnataka', isActive: true, supportedLanguages: ['en', 'kn'] },
  { stateCode: 'TN', stateName: 'Tamil Nadu', capital: 'Chennai', portalTitle: 'eSevai DigiConnect TN', isActive: true, supportedLanguages: ['en', 'ta'] },
  { stateCode: 'GJ', stateName: 'Gujarat', capital: 'Gandhinagar', portalTitle: 'Digital Gujarat DigiConnect', isActive: true, supportedLanguages: ['en', 'gu'] },
  { stateCode: 'RJ', stateName: 'Rajasthan', capital: 'Jaipur', portalTitle: 'e-Mitra DigiConnect Rajasthan', isActive: true, supportedLanguages: ['en', 'hi'] },
  { stateCode: 'MP', stateName: 'Madhya Pradesh', capital: 'Bhopal', portalTitle: 'MP e-District DigiConnect', isActive: true, supportedLanguages: ['en', 'hi'] },
  { stateCode: 'WB', stateName: 'West Bengal', capital: 'Kolkata', portalTitle: 'Banglarbhumi DigiConnect WB', isActive: true, supportedLanguages: ['en', 'bn'] },
  { stateCode: 'BR', stateName: 'Bihar', capital: 'Patna', portalTitle: 'RTPS Bihar DigiConnect', isActive: true, supportedLanguages: ['en', 'hi'] },
  { stateCode: 'DL', stateName: 'Delhi (NCT)', capital: 'New Delhi', portalTitle: 'e-District Delhi DigiConnect', isActive: true, supportedLanguages: ['en', 'hi'] },
  { stateCode: 'KL', stateName: 'Kerala', capital: 'Thiruvananthapuram', portalTitle: 'Akshaya DigiConnect Kerala', isActive: true, supportedLanguages: ['en', 'ml'] },
  { stateCode: 'PB', stateName: 'Punjab', capital: 'Chandigarh', portalTitle: 'Sewa Kendra DigiConnect Punjab', isActive: true, supportedLanguages: ['en', 'pa'] },
  { stateCode: 'HR', stateName: 'Haryana', capital: 'Chandigarh', portalTitle: 'Saral DigiConnect Haryana', isActive: true, supportedLanguages: ['en', 'hi'] },
  { stateCode: 'OD', stateName: 'Odisha', capital: 'Bhubaneswar', portalTitle: 'Odisha e-District DigiConnect', isActive: true, supportedLanguages: ['en', 'or'] },
  { stateCode: 'JH', stateName: 'Jharkhand', capital: 'Ranchi', portalTitle: 'JharSewa DigiConnect Jharkhand', isActive: true, supportedLanguages: ['en', 'hi'] },
  { stateCode: 'AS', stateName: 'Assam', capital: 'Dispur', portalTitle: 'Sewa Setu DigiConnect Assam', isActive: true, supportedLanguages: ['en', 'as'] },
  { stateCode: 'CT', stateName: 'Chhattisgarh', capital: 'Raipur', portalTitle: 'e-District CG DigiConnect', isActive: true, supportedLanguages: ['en', 'hi'] },
  { stateCode: 'UT', stateName: 'Uttarakhand', capital: 'Dehradun', portalTitle: 'e-District UK DigiConnect', isActive: true, supportedLanguages: ['en', 'hi'] },
  { stateCode: 'HP', stateName: 'Himachal Pradesh', capital: 'Shimla', portalTitle: 'e-District HP DigiConnect', isActive: true, supportedLanguages: ['en', 'hi'] },
  { stateCode: 'TR', stateName: 'Tripura', capital: 'Agartala', portalTitle: 'e-District Tripura DigiConnect', isActive: true, supportedLanguages: ['en', 'bn'] },
  { stateCode: 'ML', stateName: 'Meghalaya', capital: 'Shillong', portalTitle: 'Meghalaya e-District DigiConnect', isActive: true, supportedLanguages: ['en'] },
  { stateCode: 'MN', stateName: 'Manipur', capital: 'Imphal', portalTitle: 'Manipur e-District DigiConnect', isActive: true, supportedLanguages: ['en'] },
  { stateCode: 'NL', stateName: 'Nagaland', capital: 'Kohima', portalTitle: 'Nagaland e-District DigiConnect', isActive: true, supportedLanguages: ['en'] },
  { stateCode: 'GA', stateName: 'Goa', capital: 'Panaji', portalTitle: 'GoaOnline DigiConnect', isActive: true, supportedLanguages: ['en', 'kok'] },
  { stateCode: 'AR', stateName: 'Arunachal Pradesh', capital: 'Itanagar', portalTitle: 'Arunachal e-Services DigiConnect', isActive: true, supportedLanguages: ['en'] },
  { stateCode: 'MZ', stateName: 'Mizoram', capital: 'Aizawl', portalTitle: 'Mizoram e-District DigiConnect', isActive: true, supportedLanguages: ['en'] },
  { stateCode: 'SK', stateName: 'Sikkim', capital: 'Gangtok', portalTitle: 'Sikkim e-District DigiConnect', isActive: true, supportedLanguages: ['en'] },
  // Union Territories
  { stateCode: 'JK', stateName: 'Jammu and Kashmir', capital: 'Srinagar/Jammu', portalTitle: 'JK e-Services DigiConnect', isActive: true, supportedLanguages: ['en', 'ur'] },
  { stateCode: 'LA', stateName: 'Ladakh', capital: 'Leh', portalTitle: 'Ladakh e-District DigiConnect', isActive: true, supportedLanguages: ['en'] },
  { stateCode: 'CH', stateName: 'Chandigarh', capital: 'Chandigarh', portalTitle: 'Chandigarh Administration DigiConnect', isActive: true, supportedLanguages: ['en', 'hi', 'pa'] },
  { stateCode: 'PY', stateName: 'Puducherry', capital: 'Puducherry', portalTitle: 'Puducherry e-District DigiConnect', isActive: true, supportedLanguages: ['en', 'ta'] },
  { stateCode: 'AN', stateName: 'Andaman & Nicobar Islands', capital: 'Port Blair', portalTitle: 'e-District A&N DigiConnect', isActive: true, supportedLanguages: ['en', 'hi'] },
  { stateCode: 'DN', stateName: 'Dadra and Nagar Haveli and Daman and Diu', capital: 'Daman', portalTitle: 'DNHDD e-Services DigiConnect', isActive: true, supportedLanguages: ['en', 'gu'] },
  { stateCode: 'LD', stateName: 'Lakshadweep', capital: 'Kavaratti', portalTitle: 'Lakshadweep e-Services DigiConnect', isActive: true, supportedLanguages: ['en', 'ml'] },
];
