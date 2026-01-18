# Frontend Design Guidelines

When implementing frontend tasks, follow these guidelines to create distinctive, production-grade interfaces.

> Source: Integrated from `~/.claude/skills/frontend-design/SKILL.md`

## Frontend Task Detection

A task is considered a **frontend task** if ANY of these apply:

### By Keywords in Task Description
- UI, interface, component, page, view, form, modal, dialog
- Frontend, front-end, client-side
- Button, input, dropdown, navigation, menu, header, footer
- Layout, grid, flex, responsive, mobile
- Style, styling, theme, dark mode, light mode
- Animation, transition, hover, interaction

### By File Types
- `.tsx`, `.jsx` (React components)
- `.vue` (Vue components)
- `.css`, `.scss`, `.sass`, `.less` (Stylesheets)
- `.html` (HTML templates)
- `.svelte` (Svelte components)

### By Capability/Spec Names
- Contains: `ui`, `frontend`, `component`, `page`, `view`, `interface`

## Design Thinking (Required Before Coding)

Before writing any frontend code, explicitly address:

1. **Purpose**: What problem does this interface solve? Who uses it?
2. **Tone**: Pick a BOLD aesthetic direction:
   - Brutally minimal
   - Maximalist chaos
   - Retro-futuristic
   - Organic/natural
   - Luxury/refined
   - Playful/toy-like
   - Editorial/magazine
   - Brutalist/raw
   - Art deco/geometric
   - Soft/pastel
   - Industrial/utilitarian
3. **Constraints**: Technical requirements (framework, performance, accessibility)
4. **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

## Frontend Aesthetics Guidelines

### Typography
- Choose fonts that are beautiful, unique, and interesting
- **AVOID**: Generic fonts like Arial, Inter, Roboto, system fonts
- **DO**: Distinctive choices that elevate aesthetics
- Pair a distinctive display font with a refined body font

### Color & Theme
- Commit to a cohesive aesthetic
- Use CSS variables for consistency
- Dominant colors with sharp accents outperform timid, evenly-distributed palettes
- **AVOID**: Cliched color schemes (especially purple gradients on white backgrounds)

### Motion & Animation
- Use animations for effects and micro-interactions
- Prefer CSS-only solutions for HTML
- Use Motion library for React when available
- Focus on high-impact moments:
  - One well-orchestrated page load with staggered reveals (`animation-delay`)
  - Scroll-triggering effects
  - Hover states that surprise

### Spatial Composition
- Unexpected layouts
- Asymmetry
- Overlap
- Diagonal flow
- Grid-breaking elements
- Generous negative space OR controlled density

### Backgrounds & Visual Details
- Create atmosphere and depth (not just solid colors)
- Consider:
  - Gradient meshes
  - Noise textures
  - Geometric patterns
  - Layered transparencies
  - Dramatic shadows
  - Decorative borders
  - Custom cursors
  - Grain overlays

## Anti-Patterns (NEVER Do)

- Generic AI-generated aesthetics
- Overused font families (Inter, Roboto, Arial, system fonts)
- Cliched color schemes (purple gradients on white)
- Predictable layouts and component patterns
- Cookie-cutter design lacking context-specific character
- Same design across different generations (vary themes, fonts, aesthetics)

## Implementation Complexity

Match implementation complexity to the aesthetic vision:

| Aesthetic | Implementation |
|-----------|----------------|
| Maximalist | Elaborate code with extensive animations and effects |
| Minimalist | Restraint, precision, careful spacing, typography, subtle details |

**Key principle**: Elegance comes from executing the vision well, not from complexity alone.

## Report Format Addition

When completing frontend tasks, add this section to the standard report:

```markdown
### Frontend Design Decisions

**Aesthetic Direction:** [Chosen tone/style]

**Typography:**
- Display: [Font choice + why]
- Body: [Font choice + why]

**Color Palette:**
- Primary: [Color + purpose]
- Accent: [Color + purpose]
- Background: [Color + purpose]

**Key Visual Elements:**
- [List distinctive design choices]

**Why This Works:**
- [Brief explanation of design rationale]
```
