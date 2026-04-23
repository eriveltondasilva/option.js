# Release Guide — Option.js

Quick reference for versioning and publishing new releases.

## Release Process

### 1. Create release branch

```bash
git checkout main
git pull origin main
git checkout -b release/v1.x.x
```

### 2. Update version

```bash
# Patch (1.0.0 → 1.0.1)
npm version patch

# Minor (1.0.1 → 1.1.0)
npm version minor

# Major (1.1.0 → 2.0.0)
npm version major
```

This will:
- Update `package.json`
- Create commit
- Create git tag

### 3. Push branch and tags

```bash
git push -u origin release/v1.x.x
git push --tags
```

### 4. Create Pull Request

- Go to GitHub
- Create PR: `release/v1.x.x` → `main`
- Wait for CI checks (quality + tests)
- Merge via PR

### 5. Automatic publish

After merge, the tag triggers the GitHub Action that:
- Validates version
- Builds package
- Tests installation
- Publishes to NPM

### 6. Cleanup

```bash
git checkout main
git pull origin main
git branch -d release/v1.x.x
git push origin --delete release/v1.x.x
```

## Update CHANGELOG

Before releasing, update `CHANGELOG.md`:

```markdown
## [Unreleased]

## [1.x.x] - YYYY-MM-DD

### Added
- New feature X

### Fixed
- Bug in Y

[unreleased]: https://github.com/eriveltondasilva/option.js/compare/v1.x.x...HEAD
[1.x.x]: https://github.com/eriveltondasilva/option.js/compare/v1.y.y...v1.x.x
```

## Quick Commands

```bash
# View published versions
npm view @eriveltondasilva/option.js versions

# View local tags
git tag

# Delete tag (if needed)
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0
```