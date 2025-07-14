# Publishing Guide for Scrypto Dev CLI

## Prerequisites

1. **npm account**: Create an account at https://www.npmjs.com/
2. **npm login**: Run `npm login` and enter your credentials
3. **Git repository**: Set up a Git repository for your project

## Steps to Publish

### 1. Update Package Information

Edit `package.json`:
- Update `author` field with your name and email
- Update `repository` URL with your GitHub repository
- Update `homepage` and `bugs` URLs
- Verify the `version` field (start with `1.0.0`)

### 2. Build the Project

```bash
# Install dependencies
npm install

# Build TypeScript to JavaScript
npm run build

# Test the CLI locally
node dist/index.js --help
```

### 3. Test Installation Locally

```bash
# Link the package globally for testing
npm link

# Test the command
scrypto-dev --help

# When done testing, unlink
npm unlink -g scrypto-dev
```

### 4. Prepare for Publication

```bash
# Clean and rebuild
rm -rf dist/
npm run build

# Test the package contents
npm pack --dry-run

# This shows what files will be included in the package
```

### 5. Version Management

For future updates:
```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major
```

### 6. Publish to npm

```bash
# For first publication
npm publish

# For scoped packages (if using @yourname/scrypto-dev)
npm publish --access public
```

### 7. Verify Publication

```bash
# Check if package is published
npm view scrypto-dev

# Test installation
npm install -g scrypto-dev
scrypto-dev --help
```

## Important Notes

### Package Name
- The name `scrypto-dev` might already be taken on npm
- Check availability: `npm view scrypto-dev`
- Consider alternative names:
  - `@yourname/scrypto-dev` (scoped package)
  - `scrypto-cli`
  - `radix-scrypto-dev`
  - `scrypto-developer-tools`

### Version Strategy
- Start with `1.0.0` for first stable release
- Use semantic versioning (semver)
- Update version before each publish

### Files Included
The `files` field in package.json controls what gets published:
- `dist/**/*` - Compiled JavaScript
- `README.md` - Documentation
- `DEPLOY_USAGE.md` - Usage guide
- `LICENSE` - License file

### Security
- Never include sensitive information
- Review all files before publishing
- Use `.npmignore` to exclude development files

## GitHub Integration

1. Create a GitHub repository
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/scrypto-dev-cli.git
   git push -u origin main
   ```

3. Create releases on GitHub matching your npm versions

## Maintenance

- Keep dependencies updated
- Monitor for security vulnerabilities
- Respond to issues and pull requests
- Update documentation as needed

## Troubleshooting

**Build fails:**
- Check TypeScript errors
- Verify all dependencies are installed
- Ensure Node.js version compatibility

**Publish fails:**
- Check if package name is available
- Verify npm login status
- Check package.json syntax
- Ensure version is newer than existing

**Installation fails:**
- Check Node.js version requirements
- Verify package is public
- Test with `npm install -g package-name`