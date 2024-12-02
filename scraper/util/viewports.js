const viewports = [
    // Windows 10/11 User Agents
    { width: 1366, height: 768, deviceScaleFactor: 1 }, // Windows 10 (Chrome 131)
    { width: 1920, height: 1080, deviceScaleFactor: 1 }, // Windows 11 (Chrome 131)
    { width: 1280, height: 720, deviceScaleFactor: 1 }, // Windows 10 (Chrome 130)
    { width: 1366, height: 768, deviceScaleFactor: 1 }, // Windows 11 (Chrome 130)
  
    // MacBook User Agents
    { width: 2560, height: 1600, deviceScaleFactor: 2 }, // MacBook Pro (Retina, Chrome 131)
    { width: 2560, height: 1600, deviceScaleFactor: 2 }, // MacBook Air (M1, Chrome 131)
    { width: 2560, height: 1600, deviceScaleFactor: 2 }, // MacBook Pro 13" (M1, Chrome 130)
    { width: 2560, height: 1600, deviceScaleFactor: 2 }, // MacBook Pro (Retina, Chrome 129)
    { width: 2560, height: 1600, deviceScaleFactor: 2 }, // MacBook Air (Intel, Chrome 131)
  
    // Linux User Agent
    { width: 1366, height: 768, deviceScaleFactor: 1 }, // Linux (Chrome 131)
];

export default viewports;