---
name: check-changes
description: Review current changes against project standards and conventions
---

# Instructions

When this command is invoked:

1. Run `git diff` to see unstaged changes and `git diff --cached` to see staged changes
2. For each changed file, check:
   - **Naming conventions**: PascalCase for classes/interfaces, camelCase for functions/variables, `I` prefix for interfaces, `$` suffix for Observable instances
   - **Code style**: 2-space indentation, JSDoc comments on public methods, fluent API patterns
   - **TypeScript**: Strict mode compliance in `src/`, proper type annotations, no `any` unless justified
   - **Performance**: Use `quickDeleteFromArray` over `deleteFromArray` where applicable, proper `destroy()`/`unsubscribe()` cleanup
   - **Testing**: Decorator-based test pattern (`@suite`, `@test`), Chai assertions
   - **Common issues**: Console.log/debug statements left in, unused imports, missing error handling

3. Verify changes align with the data flow architecture:
   ```
   Value -> Inbound Filters -> Observable -> Pipe -> Subscribers
   ```

4. Check for resource cleanup: `destroy()`, `unsubscribeAll()`, or `unsubscribe()` where needed

# Output Format

Present results as a checklist grouped by file:

```
## [filename]
- [ ] Issue description (line ~N)
- [x] Follows convention X correctly
```

End with a summary: total issues found, severity (critical/warning/info).
