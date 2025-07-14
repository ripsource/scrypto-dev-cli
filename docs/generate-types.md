# Generate Types Documentation

The `generate-types` command automatically generates TypeScript types for Radix packages based on their SBOR schemas. The network (mainnet/stokenet) is automatically detected from the package address prefix.

## Usage

```bash
scrypto-dev generate-types <package_address>
```

## Examples

### Mainnet Package
```bash
scrypto-dev generate-types package_rdx1pkl8tdw43xqx64etxwdf8rjtvptqurq4c3fky0kaj6vwa0zrkfmcmc
```

### Stokenet Package
```bash
scrypto-dev generate-types package_tdx_2_1pkgxxxxxxxxxfaucetxxxxxxxxx000034355863xxxxxxxxx3heqcz
```

## Network Detection

The command automatically detects the network based on the package address prefix:
- **Mainnet**: `package_rdx...`
- **Stokenet**: `package_tdx_2...`

## Output

The generated TypeScript types are written to `types/blueprint-types.ts` in your current directory. The file includes:
- Import statement for `@calamari-radix/sbor-ez-mode`
- TypeScript type definitions for all blueprints in the package
- Proper SBOR schema mappings for structs, enums, and other types

## Generated Types Example

```typescript
import s from '@calamari-radix/sbor-ez-mode';

const MyStruct = s.struct({
  field1: s.string(),
  field2: s.decimal(),
  field3: s.address()
});

const MyEnum = s.enum({
  Variant1: s.tuple([s.string()]),
  Variant2: s.struct({
    inner_field: s.number()
  })
});
```

## Prerequisites

- Rust toolchain must be installed (for building the schema generation binary)
- The `@calamari-radix/sbor-ez-mode` package should be installed in your project to use the generated types

## Troubleshooting

If you encounter issues:
1. Ensure Rust is installed: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
2. The schema generation binary is built automatically on first use
3. Check that the package address is valid and exists on the specified network
