# React Native — integration map

| Combined skill | Why | `react-native-pro` owns | Other skill owns |
|----------------|-----|---------------------------|------------------|
| **`react-pro`** | Shared React mental model | RN-specific layout, native modules, EAS | Web-only SSR/hydration |
| **`testing-pro`** | E2E and unit | Detox/MAestro constraints, RN test utils | General pyramid |
| **`security-pro`** | Secure storage, deep links | Threat framing for mobile surface | Backend auth |
| **`deployment-pro`** | Store release | EAS Submit / pipeline hints | Infra outside app stores |
| **`design-system-pro`** | Tokens | Mobile spacing/typography application | Brand system definition |

**Handoff:** Native crashes or ABI issues → platform docs + minimal repro before JS-only fixes.
