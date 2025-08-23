# CMMN-JS Workspace Development Guide

This guide explains how to set up and use a workspace development environment for cmmn-js with local source code debugging capabilities.

## Overview

The workspace setup allows you to:
- Use local cmmn-js source code instead of npm packages
- Debug both cmmn-js core and example applications simultaneously
- Make changes to cmmn-js and see immediate effects in examples
- Maintain proper linking between all related packages

## Workspace Structure

```
cmmn-js-env/
├── package.json                    # Workspace root package.json
├── cmmn-js/                       # Main cmmn-js source code
├── cmmn-js-examples/              # Examples that use cmmn-js
│   ├── bundling/                  # Browserify + CommonJS example
│   └── properties-panel/          # Grunt-based properties panel example  
├── cmmn-moddle/                   # CMMN model definitions
├── diagram-js/                    # Diagramming toolkit
├── moddle/                        # Base moddle library
├── moddle-xml/                    # XML parsing for moddle
└── WORKSPACE_DEVELOPMENT_GUIDE.md # This guide
```

## Setup Instructions

### 1. Workspace Configuration

The root `package.json` defines workspaces and common scripts:

```json
{
  "name": "cmmn-js-workspace",
  "private": true,
  "workspaces": [
    "cmmn-js",
    "cmmn-js-examples/bundling", 
    "cmmn-js-examples/properties-panel",
    "cmmn-moddle",
    "diagram-js",
    "moddle",
    "moddle-xml"
  ],
  "scripts": {
    "install:all": "npm install",
    "build:cmmn-js": "npm run distro --workspace=cmmn-js",
    "dev:bundling": "npm run dev --workspace=cmmn-js-examples-bundling",
    "dev:properties-panel": "npm run dev --workspace=cmmn-js-examples-properties-panel"
  }
}
```

### 2. Example Project Updates

Each example project has been updated to use local cmmn-js:

**bundling/package.json:**
- Changed name to `cmmn-js-examples-bundling` for workspace compatibility
- Updated dependency: `"cmmn-js": "file:../../cmmn-js"`
- Added `--debug` flag for source maps in browserify commands

**properties-panel/package.json:**  
- Changed name to `cmmn-js-examples-properties-panel`
- Updated dependency: `"cmmn-js": "file:../../cmmn-js"`

### 3. Build Tool Compatibility Issues

**Current Challenge:** The source packages use modern ES6 modules while examples use older build tools:
- cmmn-js dependencies use `export { default }` syntax
- Browserify with older babelify has issues with ES6 modules in node_modules
- This requires additional transform configuration or build tool updates

## Development Workflows

### Basic Setup
```bash
# Install all workspace dependencies
npm install

# Install dependencies for specific examples (if workspace install has issues)
cd cmmn-js-examples/bundling
npm install --no-workspaces
```

### Development Commands

**Root Level Commands:**
```bash
# Build cmmn-js distribution  
npm run build:cmmn-js

# Run bundling example in development mode
npm run dev:bundling

# Run properties panel example
npm run dev:properties-panel

# Run tests across all workspaces
npm run test:all
```

**Individual Project Commands:**
```bash
# Work on bundling example
cd cmmn-js-examples/bundling
npm run dev              # Start development server with file watching
npm run bundle           # Build once
npm run all              # Build and open in browser

# Work on properties panel  
cd cmmn-js-examples/properties-panel
npm run dev              # Grunt auto-build with watching
npm run all              # Full grunt build

# Work on cmmn-js core
cd cmmn-js
npm run dev              # Run tests in watch mode
npm run test             # Run tests once
npm run distro           # Build distribution files
```

## Debugging Setup

### Source Maps
- Browserify commands include `--debug` flag for inline source maps
- This allows debugging of both example code and linked cmmn-js source

### Browser DevTools
1. Open the bundled example in browser
2. Open DevTools → Sources tab  
3. You can now set breakpoints in:
   - Example application code (`src/app.js`)
   - Linked cmmn-js source code (under `file://` paths)
   - All dependencies with proper source mapping

### IDE Setup
Configure your IDE to recognize the workspace structure:
- Set project root to `cmmn-js-env/` 
- Add all workspace directories to the project
- Enable JavaScript/TypeScript support for proper IntelliSense

## Troubleshooting

### Common Issues

**1. Build Tool Compatibility**
- **Problem:** ES6 modules in dependencies not transpiled properly
- **Solution:** Update build tools or add module-specific transforms
- **Current Status:** Requires updated babel/browserify configuration

**2. Workspace Dependency Resolution**
- **Problem:** npm workspace resolution conflicts
- **Solution:** Use `--no-workspaces` flag for individual installs
- **Alternative:** Use `file:` protocol for dependencies

**3. Version Mismatches**
- **Problem:** Different versions of shared dependencies
- **Solution:** Use `npm dedupe` or specify exact versions

### Build Tool Updates Needed

For full compatibility, consider updating:
```bash
# Update to modern build tools
npm install --save-dev @babel/core @babel/preset-env
npm install --save-dev webpack webpack-cli webpack-dev-server

# Or use newer versions of browserify tools
npm install --save-dev browserify@latest babelify@latest
```

## Alternative Approaches

### Option 1: npm link
Instead of workspaces, use npm link:
```bash
cd cmmn-js
npm link

cd ../cmmn-js-examples/bundling  
npm link cmmn-js
```

### Option 2: Direct File References
Update package.json dependencies to use file paths:
```json
{
  "dependencies": {
    "cmmn-js": "file:../../cmmn-js"
  }
}
```

### Option 3: Modern Build Tools
Replace browserify with webpack or vite:
- Better ES6 module support
- Improved development servers
- Hot module replacement
- Better debugging experience

## Benefits of Workspace Development

1. **Unified Development:** Work on core and examples simultaneously
2. **Real-time Testing:** See changes immediately across projects  
3. **Debugging:** Step through core library code from examples
4. **Dependency Management:** Single install manages all projects
5. **Consistency:** Shared tooling and configuration across projects

## Next Steps

1. **Resolve Build Compatibility:** Update babel/browserify configuration for ES6 modules
2. **Modernize Tooling:** Consider migration to webpack or vite
3. **Add More Examples:** Include additional workspace projects as needed
4. **CI/CD Integration:** Set up automated testing across the workspace

This workspace approach provides a professional development environment for cmmn-js with full source code access and debugging capabilities across all related projects.