# Changesets

这个目录用于管理包版本、变更日志和发布流程。

## 日常开发

每次完成会影响对外使用的改动后，执行：

```bash
pnpm changeset
```

根据提示选择受影响的包和版本类型：

- `patch`：问题修复、内部优化，不改变 API。
- `minor`：新增能力，保持兼容。
- `major`：破坏性变更。

命令会在 `.changeset` 下生成一份变更说明，需要和代码一起提交。

## 发布

发布前先根据变更集更新版本：

```bash
pnpm version-packages
```

该命令会更新各包的 `version`、内部依赖版本和 `CHANGELOG.md`。

检查通过后发布：

```bash
pnpm check
pnpm release
```

发布后再提交版本变更并打 tag。
