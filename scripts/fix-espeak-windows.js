#!/usr/bin/env node

/**
 * Fix eSpeak-NG installation issues on Windows
 * This script helps diagnose and fix common eSpeak-NG problems on Windows
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function checkEspeakInstallation() {
  console.log('🔍 Checking eSpeak-NG installation...\n');
  
  try {
    // Try different possible eSpeak commands
    const commands = ['espeak-ng', 'espeak', 'eSpeak'];
    let workingCommand = null;
    
    for (const cmd of commands) {
      try {
        const version = execSync(`${cmd} --version`, { encoding: 'utf8', stdio: 'pipe' });
        console.log(`✅ Found ${cmd}: ${version.trim()}`);
        workingCommand = cmd;
        break;
      } catch (error) {
        console.log(`❌ ${cmd} not found`);
      }
    }
    
    if (!workingCommand) {
      console.log('\n❌ No eSpeak installation found');
      return null;
    }
    
    return workingCommand;
  } catch (error) {
    console.log('❌ Error checking eSpeak installation:', error.message);
    return null;
  }
}

function findEspeakDataPath() {
  console.log('\n🔍 Looking for eSpeak data directory...\n');
  
  const possiblePaths = [
    'C:\\Program Files\\eSpeak NG\\espeak-ng-data',
    'C:\\Program Files (x86)\\eSpeak NG\\espeak-ng-data',
    'C:\\espeak-ng\\espeak-ng-data',
    'C:\\espeak\\espeak-data',
    process.env.ESPEAK_DATA_PATH
  ].filter(Boolean);
  
  for (const dataPath of possiblePaths) {
    if (fs.existsSync(dataPath)) {
      console.log(`✅ Found eSpeak data at: ${dataPath}`);
      return dataPath;
    } else {
      console.log(`❌ Not found: ${dataPath}`);
    }
  }
  
  console.log('\n❌ No eSpeak data directory found');
  return null;
}

function setEnvironmentVariable(dataPath) {
  console.log('\n🔧 Setting ESPEAK_DATA_PATH environment variable...\n');
  
  try {
    // Set for current session
    process.env.ESPEAK_DATA_PATH = dataPath;
    console.log(`✅ Set ESPEAK_DATA_PATH to: ${dataPath}`);
    
    // Try to set permanently using PowerShell
    const command = `powershell -Command "[Environment]::SetEnvironmentVariable('ESPEAK_DATA_PATH', '${dataPath}', 'User')"`;
    execSync(command, { stdio: 'pipe' });
    console.log('✅ Environment variable set permanently for current user');
    
    return true;
  } catch (error) {
    console.log('❌ Failed to set environment variable permanently:', error.message);
    console.log('💡 You may need to set it manually in System Properties > Environment Variables');
    return false;
  }
}

function testEspeakWithDataPath(command, dataPath) {
  console.log('\n🧪 Testing eSpeak with data path...\n');
  
  try {
    // Set the environment variable for this test
    const env = { ...process.env, ESPEAK_DATA_PATH: dataPath };
    
    // Test a simple synthesis
    const testFile = path.join(__dirname, 'test_output.wav');
    const testCommand = `${command} -w "${testFile}" "test"`;
    
    console.log(`Running: ${testCommand}`);
    execSync(testCommand, { env, stdio: 'pipe' });
    
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile); // Clean up
      console.log('✅ eSpeak test successful!');
      return true;
    } else {
      console.log('❌ eSpeak test failed - no output file created');
      return false;
    }
  } catch (error) {
    console.log('❌ eSpeak test failed:', error.message);
    return false;
  }
}

function downloadEspeakNG() {
  console.log('\n📥 eSpeak-NG installation options:\n');
  
  console.log('1. Download from GitHub releases:');
  console.log('   https://github.com/espeak-ng/espeak-ng/releases');
  console.log('   Look for Windows installer (.msi file)');
  
  console.log('\n2. Install via Chocolatey (if you have it):');
  console.log('   choco install espeak');
  
  console.log('\n3. Install via Scoop (if you have it):');
  console.log('   scoop install espeak');
  
  console.log('\n4. Use Windows Subsystem for Linux (WSL):');
  console.log('   wsl --install');
  console.log('   wsl sudo apt-get install espeak-ng');
  
  console.log('\n5. Alternative: Use Windows Speech API instead');
  console.log('   npm run generate-phonemes-windows');
}

function main() {
  console.log('🔧 eSpeak-NG Windows Fix Tool\n');
  
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`Usage: npm run fix-espeak-windows [options]

Options:
  --help, -h       Show this help message
  --install        Show installation instructions
  --test           Test current installation

Examples:
  npm run fix-espeak-windows           # Full diagnostic
  npm run fix-espeak-windows --test    # Test only
  npm run fix-espeak-windows --install # Show install options
`);
    return;
  }
  
  if (args.includes('--install')) {
    downloadEspeakNG();
    return;
  }
  
  // Step 1: Check if eSpeak is installed
  const espeakCommand = checkEspeakInstallation();
  
  if (!espeakCommand) {
    console.log('\n💡 eSpeak-NG is not installed or not in PATH');
    downloadEspeakNG();
    return;
  }
  
  // Step 2: Find data directory
  const dataPath = findEspeakDataPath();
  
  if (!dataPath) {
    console.log('\n💡 eSpeak data directory not found');
    downloadEspeakNG();
    return;
  }
  
  // Step 3: Set environment variable
  setEnvironmentVariable(dataPath);
  
  // Step 4: Test eSpeak
  const testResult = testEspeakWithDataPath(espeakCommand, dataPath);
  
  if (testResult) {
    console.log('\n🎉 eSpeak-NG is now working correctly!');
    console.log('\n💡 Next steps:');
    console.log('   1. Restart your terminal/command prompt');
    console.log('   2. Try: npm run generate-phonemes');
    console.log('   3. If it still fails, try: npm run generate-phonemes-windows');
  } else {
    console.log('\n❌ eSpeak-NG still has issues');
    console.log('\n💡 Alternative solutions:');
    console.log('   1. Try: npm run generate-phonemes-windows');
    console.log('   2. Reinstall eSpeak-NG using the options above');
    console.log('   3. Use WSL for a Linux environment');
  }
}

if (require.main === module) {
  main();
} 