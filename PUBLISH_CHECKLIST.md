# Publication Checklist

## Before Publishing

- [ ] **Update package.json**
  - [ ] Set correct author name and email
  - [ ] Update repository URL
  - [ ] Verify version number (1.0.0 for first release)
  - [ ] Check package name availability on npm

- [ ] **Test locally**
  - [ ] Run `npm install` to install dependencies
  - [ ] Run `npm run build` to compile TypeScript
  - [ ] Test CLI with `node dist/index.js --help`
  - [ ] Link locally with `npm link` and test `scrypto-dev --help`

- [ ] **Documentation**
  - [ ] Complete README.md with installation instructions
  - [ ] Include usage examples
  - [ ] Document all commands
  - [ ] Add troubleshooting section

- [ ] **Quality checks**
  - [ ] No TypeScript compilation errors
  - [ ] All commands work as expected
  - [ ] Error handling is appropriate
  - [ ] Help text is clear and helpful

## Publishing Steps

1. **Login to npm**
   ```bash
   npm login
   ```

2. **Final build**
   ```bash
   npm run build
   ```

3. **Check package contents**
   ```bash
   npm pack --dry-run
   ```

4. **Publish**
   ```bash
   npm publish
   ```

5. **Verify**
   ```bash
   npm view scrypto-dev
   ```

## After Publishing

- [ ] **Test installation**
  ```bash
  npm install -g scrypto-dev
  scrypto-dev --help
  ```

- [ ] **Create GitHub release**
  - [ ] Tag the version
  - [ ] Write release notes
  - [ ] Include changelog

- [ ] **Update documentation**
  - [ ] Update README with npm installation instructions
  - [ ] Add badges (version, downloads, etc.)

## Future Updates

- [ ] **Version updates**
  - [ ] Use `npm version patch|minor|major`
  - [ ] Update changelog
  - [ ] Re-publish with `npm publish`

- [ ] **Maintenance**
  - [ ] Monitor for issues
  - [ ] Update dependencies regularly
  - [ ] Respond to community feedback

## Common Issues

**Package name taken:**
- Try scoped package: `@yourname/scrypto-dev`
- Alternative names: `scrypto-cli`, `radix-scrypto-dev`

**Build errors:**
- Check TypeScript configuration
- Verify all dependencies are installed
- Ensure Node.js version compatibility

**Permission errors:**
- Use `npm login` to authenticate
- Check if you have publish permissions
- Verify package name doesn't conflict