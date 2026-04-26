# Project conventions

## Styling: NEVER use inline styles

Inline styles are **strictly forbidden** in this codebase. Do not introduce them under any circumstance, not even for a single theme-dependent property.

This rule applies to every JSX style-like prop: `style`, `contentContainerStyle`, `listHeaderComponentStyle`, `labelStyle`, `ItemSeparatorComponent` style args, etc.

### What counts as an inline style

Any object literal written directly inside a style-like prop, whether alone or inside an array:

```tsx
// FORBIDDEN
<View style={{ color: theme.textColor }} />
<Text style={[styles.title, { color: theme.textColor }]} />
<ScrollView style={[styles.scroll, { backgroundColor: theme.backgroundColor }]} />
```

Also forbidden: object literals built via `React.useMemo` / `useCallback` (or any other in-component construction) and then passed to a style prop — they bypass `StyleSheet.create` and have the same downsides.

```tsx
// ALSO FORBIDDEN
const buttonStyle = React.useMemo(() => ({ ...styles.button, backgroundColor: theme.primaryColor }), [theme]);
<TouchableOpacity style={buttonStyle} />
```

### Why

- `StyleSheet.create` registers styles once and passes a numeric ID across the native bridge. Inline objects are re-serialized every render.
- Inline styles defeat memoization: every render produces a new object identity, which cascades into child re-renders and breaks `React.memo` / `PureComponent`.
- Theme-aware styles belong in one place per component so the wiring (which prop reads which token) is reviewable in isolation.

### The required pattern

Use `useThemedStyles` (`src/theme/useThemedStyles.ts`) with a module-level factory. See `src/screens/ParticipantsScreen/screens/Ongoing/index.tsx` for the canonical example.

```tsx
import { useThemedStyles } from '@app/theme/useThemedStyles';
import { TournamentTheme } from '@app/types/tournamentConfig';
import { StyleSheet, Text, View } from 'react-native';

export const MyComponent: React.FC = () => {
  const themedStyles = useThemedStyles(themedStylesFactory);
  return (
    <View style={themedStyles.container}>
      <Text style={themedStyles.title}>Hello</Text>
    </View>
  );
};

// Theme-dependent styles live here. The factory must be module-level so its
// identity is stable and `useThemedStyles` memoizes correctly.
const themedStylesFactory = (theme: TournamentTheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.backgroundColor },
    title: { fontSize: 18, color: theme.textColor },
  });

// Theme-independent styles stay in a plain StyleSheet.create at module scope.
const styles = StyleSheet.create({
  // ...
});
```

Split the two: put every theme-dependent style in the `themedStylesFactory`, and every theme-independent style in the plain `styles` block. Do not merge tokens into a single shape at the JSX call site.

For state-dependent toggles (e.g. `disabled`, `isPending`), define a dedicated style entry (`buttonPending: { opacity: 0.5 }`) and compose via an array — never an inline object:

```tsx
<TouchableOpacity
  style={[themedStyles.button, isPending && styles.buttonPending]}
/>
```

### When adding or modifying styles

- If the style reads from `theme`, it goes in `themedStylesFactory`.
- If not, it goes in the module-level `styles` `StyleSheet.create` block.
- Never create a style object inside the component body (no `useMemo`, no `{}` literals, no spreads into a new object).
- Never mutate `theme.*` into a prop object at render time — bind the token inside the factory instead.

## Commit messages: ALWAYS use Conventional Commits

Every commit on this repository **MUST** use the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<optional scope>)<!>: <subject>

<optional body>

<optional footers, e.g. BREAKING CHANGE: ...>
```

This rule applies to every commit, including any made with a `Co-Authored-By: Claude` trailer. There are no exemptions.

### Allowed types

`feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `ci`, `build`, `perf`, `style`, `revert`. Pick the type that best matches the change; do not invent new ones.

### Version-bump semantics

The `release-please` workflow (`.github/workflows/release-please.yml`) derives the next semantic version and the `CHANGELOG.md` entries directly from these commit messages:

- `feat:` → minor bump
- `fix:` → patch bump
- `feat!:` / `fix!:` / any commit with a `BREAKING CHANGE:` footer → major bump
- All other types do not bump the version but still appear in the changelog when grouped.

A non-conformant commit message is silently ignored by release-please and therefore vanishes from the changelog and the version computation. Treat that as a correctness bug, not a stylistic preference.

### Examples

```
feat(participants): add filter for ongoing tournaments
fix(api): retry on 502 instead of failing the request
refactor(theme): collapse useThemedStyles helpers into one module
feat!: drop legacy `tournamentId` prop from `<Header>`

BREAKING CHANGE: callers must pass `tournament` instead of `tournamentId`.
```
