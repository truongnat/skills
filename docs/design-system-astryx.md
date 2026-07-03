# Design System Baseline

## Mục tiêu

Tài liệu này định nghĩa baseline design cho mọi HTML preview, tool UI, artifact UI, và template giao diện trong repo này.

Baseline tham chiếu theo Astryx Design System tại thời điểm đọc tài liệu ngày 2026-07-03:

- Docs: https://astryx.atmeta.com/docs/getting-started
- Principles: https://astryx.atmeta.com/docs/principles
- Theme System: https://astryx.atmeta.com/docs/theme
- Color: https://astryx.atmeta.com/docs/color
- Shape: https://astryx.atmeta.com/docs/shape
- Spacing: https://astryx.atmeta.com/docs/spacing
- Typography: https://astryx.atmeta.com/docs/typography
- Motion: https://astryx.atmeta.com/docs/motion
- Themes gallery: https://astryx.atmeta.com/themes

Repo này không copy nguyên Astryx implementation. Thay vào đó, repo dùng một baseline tương thích tinh thần Astryx:

- semantic token trước, màu hardcode sau
- UI tối giản, rõ hierarchy, ít trang trí
- component-like layout thay vì raw HTML tùy hứng
- typography và spacing có scale ổn định
- motion ít nhưng có chủ đích
- light mode mặc định; dark mode chỉ thêm khi có yêu cầu rõ

## Nguyên tắc bắt buộc

1. Không viết HTML preview theo style ngẫu hứng từng tool.
2. Không đưa palette riêng, gradient riêng, font riêng nếu chưa đi qua baseline này.
3. Khi cần custom, custom ở mức token semantic trước rồi mới custom component.
4. Không hardcode màu kiểu `#fff`, `#000`, `#f3efe6` trong UI tool mới nếu có thể map sang token semantic.
5. Ưu tiên layout theo `surface -> card -> section -> control`.
6. Nếu tool render UI tương tác, phải giữ cùng spacing, radius, text scale, border style, focus style.
7. Mọi tool có HTML nên dùng helper/chung style thay vì dựng CSS mới từ đầu.

## Design Philosophy

Theo Astryx, rule cốt lõi là:

- components over primitives
- semantic tokens over hardcoded values
- theme-agnostic code
- open internals, composable layers

Áp dụng vào repo này:

- Khi dựng preview, phải bắt đầu bằng shell/layout chuẩn.
- Mỗi tool chỉ nên custom phần nội dung đặc thù.
- CSS chung phải đóng vai trò design-system shell.

## Semantic Tokens

### Color

Các token semantic baseline lấy cảm hứng trực tiếp từ Astryx docs:

```css
--color-background-body
--color-background-surface
--color-background-muted
--color-text-primary
--color-text-secondary
--color-text-disabled
--color-accent
--color-accent-muted
--color-on-accent
--color-border
--color-border-strong
--color-overlay
--color-overlay-hover
--color-overlay-pressed
--color-success
--color-danger
--color-warning
```

### Recommended neutral baseline

Light-first baseline cho repo:

```css
--color-background-body: #F8F4ED;
--color-background-surface: #FFFFFF;
--color-background-muted: rgba(5, 54, 89, 0.05);
--color-text-primary: #15110C;
--color-text-secondary: #4E606F;
--color-text-disabled: #A4B0BC;
--color-accent: #15110C;
--color-accent-muted: rgba(21, 17, 12, 0.08);
--color-on-accent: #FFFFFF;
--color-border: rgba(5, 54, 89, 0.16);
--color-border-strong: rgba(21, 17, 12, 0.22);
--color-overlay: rgba(1, 18, 40, 0.40);
--color-overlay-hover: rgba(5, 54, 89, 0.05);
--color-overlay-pressed: rgba(5, 54, 89, 0.10);
--color-success: #1A7F37;
--color-danger: #B42318;
--color-warning: #9A6700;
```

### Color Rules

- nền tổng thể dùng `--color-background-body`
- mọi card/control dùng `--color-background-surface`
- vùng phụ, toolbar, preview note dùng `--color-background-muted`
- text chính dùng `--color-text-primary`
- text phụ dùng `--color-text-secondary`
- border mặc định dùng `--color-border`
- action chính dùng `--color-accent` + `--color-on-accent`
- trạng thái dùng success/danger/warning semantic

## Shape

Astryx docs mô tả radius scale semantic:

```css
--radius-none: 0px;
--radius-inner: 8px;
--radius-element: 12px;
--radius-container: 16px;
--radius-page: 32px;
--radius-chat: 28px;
--radius-full: 9999px;
```

### Shape Rules

- input/button/chip/small panel: `--radius-element`
- card/section/panel: `--radius-container`
- page shell/hero wrapper lớn: `--radius-page` chỉ khi thực sự cần
- badge/pill/filter: `--radius-full`
- tránh bo góc quá mềm kiểu "AI blob"

## Spacing

Astryx dùng scale base 4px.

```css
--spacing-0: 0px;
--spacing-0-5: 2px;
--spacing-1: 4px;
--spacing-1-5: 6px;
--spacing-2: 8px;
--spacing-3: 12px;
--spacing-4: 16px;
--spacing-5: 20px;
--spacing-6: 24px;
--spacing-7: 28px;
--spacing-8: 32px;
--spacing-9: 36px;
--spacing-10: 40px;
--spacing-11: 44px;
--spacing-12: 48px;
```

### Spacing Rules

- gap mặc định giữa control nhỏ: `--spacing-2` hoặc `--spacing-3`
- padding control: `--spacing-2` đến `--spacing-3`
- padding card: `--spacing-4`
- gap section: `--spacing-4` đến `--spacing-6`
- margin page: `--spacing-6`
- không dùng spacing lẻ ngoài scale trừ khi có lý do rõ

## Typography

Astryx docs mô tả:

- geometric type scale
- base mặc định 14px
- ratio mặc định 1.2
- semantic text roles thay vì raw px

### Repo baseline

```css
--font-family-body: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--font-family-heading: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--font-family-code: "SFMono-Regular", Consolas, "Cascadia Code", monospace;

--font-size-body: 14px;
--font-size-label: 12px;
--font-size-title-sm: 16px;
--font-size-title-md: 20px;
--font-size-title-lg: 24px;

--line-height-body: 1.5;
--line-height-heading: 1.2;
```

### Typography Rules

- body text mặc định 14px
- label, metadata, badge dùng 12px
- page title tool preview dùng 24px hoặc 20px tùy density
- section title dùng 16px hoặc 20px
- code/log/table cell dùng font mono
- heading đậm vừa phải, không dùng display font lạ nếu chưa có theme riêng

## Motion

Astryx docs đưa ra baseline duration:

```css
--duration-fast-min: 130ms;
--duration-fast: 175ms;
--duration-fast-max: 230ms;
--duration-medium-min: 310ms;
--duration-medium: 410ms;
--duration-medium-max: 550ms;
--ease-standard: cubic-bezier(0.24, 1, 0.4, 1);
```

### Motion Rules

- hover/focus: 130ms đến 175ms
- panel/filter/reveal: 175ms đến 310ms
- tránh animation dài hoặc trang trí
- animation phải hỗ trợ `prefers-reduced-motion`

## Layout Patterns

### Shell chuẩn

Mọi preview page nên theo khung:

1. page background `body`
2. `main` max-width
3. `hero` hoặc header ngắn
4. nội dung trong `card` hoặc `surface`

### Component patterns

- `hero`: giới thiệu ngắn, title + metadata
- `card`: container nội dung chính
- `toolbar`: search/filter/action
- `table`: header sticky nếu có scroll
- `badge`: metadata ngắn
- `actions`: hàng button/action ngắn
- `columns`: grid responsive

## HTML Preview Rules

Khi tool generate HTML:

- phải dùng semantic token CSS variables
- phải có hierarchy rõ: hero/card/section/control
- không dùng CSS demo style riêng nếu helper chung đã cover
- không dùng màu nổi bật trừ khi là status hoặc primary action
- nếu có custom CSS, custom phải additive và đúng baseline

## Tool Authoring Rules

Với tool mới có preview HTML:

1. Dùng `src/tooling/preview-launcher.ts` nếu phù hợp.
2. Không tự viết lại page shell nếu helper chung đủ dùng.
3. Nếu cần style riêng, chỉ override cục bộ cho domain component.
4. README tool phải mô tả rõ tool render loại UI nào.
5. Nếu custom style nhiều, phải update lại tài liệu này hoặc nêu rõ vì sao ngoại lệ.

## Non-goals

- Không cố clone 1:1 toàn bộ Astryx component library.
- Không cố sync đầy đủ mọi token của Astryx.
- Không thêm dependency styling mới chỉ để “giống hệt”.

## Definition of Done

Một tool/UI được coi là đạt baseline khi:

- không còn palette ad-hoc
- không còn spacing/radius/font tùy hứng
- có shell và hierarchy nhất quán
- bám token semantic chung
- nhìn không lệch khỏi tinh thần Astryx neutral theme
