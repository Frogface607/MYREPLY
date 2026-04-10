from PIL import Image, ImageDraw, ImageFont
import os

# Canvas
W, H = 1080, 1080
bg = (250, 249, 247)       # #FAF9F7
navy = (26, 35, 50)        # #1A2332
teal = (30, 139, 139)      # #1E8B8B
red = (231, 76, 60)        # #E74C3C
gray = (155, 155, 155)
white = (255, 255, 255)
star_dim = (210, 205, 195)

img = Image.new('RGB', (W, H), bg)
draw = ImageDraw.Draw(img)

# Fonts
fd = "C:/Windows/Fonts/"
f_bold_72 = ImageFont.truetype(fd + "arialbd.ttf", 76)
f_bold_64 = ImageFont.truetype(fd + "arialbd.ttf", 68)
f_reg_28 = ImageFont.truetype(fd + "arial.ttf", 30)
f_reg_24 = ImageFont.truetype(fd + "arial.ttf", 26)
f_bold_38 = ImageFont.truetype(fd + "arialbd.ttf", 40)
f_bold_20 = ImageFont.truetype(fd + "arialbd.ttf", 22)

# Helper: centered text
def text_center(y, text, font, color):
    bb = draw.textbbox((0, 0), text, font=font)
    w = bb[2] - bb[0]
    draw.text(((W - w) // 2, y), text, fill=color, font=font)

# Helper: draw star (5-pointed)
import math
def draw_star(cx, cy, r_outer, r_inner, fill_color):
    points = []
    for i in range(10):
        angle = math.radians(-90 + i * 36)
        r = r_outer if i % 2 == 0 else r_inner
        points.append((cx + r * math.cos(angle), cy + r * math.sin(angle)))
    draw.polygon(points, fill=fill_color)

# === NOTIFICATION CARD ===
notif_w, notif_h = 440, 60
notif_x = (W - notif_w) // 2
notif_y = 160

# Shadow
draw.rounded_rectangle(
    [notif_x + 1, notif_y + 3, notif_x + notif_w + 1, notif_y + notif_h + 3],
    radius=30, fill=(235, 233, 228)
)
# Card
draw.rounded_rectangle(
    [notif_x, notif_y, notif_x + notif_w, notif_y + notif_h],
    radius=30, fill=white
)

# Red badge with bell icon
badge_cx = notif_x + 34
badge_cy = notif_y + notif_h // 2
draw.rounded_rectangle(
    [badge_cx - 17, badge_cy - 17, badge_cx + 17, badge_cy + 17],
    radius=7, fill=red
)
# Simplified bell in white
draw.polygon([
    (badge_cx - 6, badge_cy - 6),
    (badge_cx + 6, badge_cy - 6),
    (badge_cx + 9, badge_cy + 3),
    (badge_cx - 9, badge_cy + 3)
], fill=white)
draw.rectangle([badge_cx - 9, badge_cy + 3, badge_cx + 9, badge_cy + 6], fill=white)
draw.ellipse([badge_cx - 2, badge_cy - 10, badge_cx + 2, badge_cy - 6], fill=white)
draw.ellipse([badge_cx - 3, badge_cy + 6, badge_cx + 3, badge_cy + 10], fill=white)

# Text "Новый отзыв"
notif_tx = badge_cx + 28
notif_ty = badge_cy - 12
draw.text((notif_tx, notif_ty), "Новый отзыв", fill=navy, font=f_reg_24)

# Stars: 1 red filled + 4 dim
star_start_x = notif_tx + int(draw.textlength("Новый отзыв", font=f_reg_24)) + 14
star_y = badge_cy
for i in range(5):
    sx = star_start_x + i * 28
    color = red if i == 0 else star_dim
    draw_star(sx, star_y, 11, 5, color)

# === MAIN HEADLINE ===
# Vertically center the text block in the remaining space
content_top = 310
text_center(content_top, "Негативный отзыв?", f_bold_72, navy)
text_center(content_top + 100, "Больше не проблема.", f_bold_64, teal)

# === SUBTITLE ===
text_center(content_top + 220, "5 вариантов ответа  ·  30 секунд  ·  Бесплатно", f_reg_28, gray)

# === DECORATIVE ELEMENTS ===
# Subtle teal dots/circles as design accents (not the big blurry circles)
for (cx, cy, r, alpha) in [
    (140, 750, 6, 80), (180, 780, 4, 60), (120, 800, 3, 50),
    (920, 300, 5, 70), (950, 340, 3, 50), (960, 280, 4, 60),
    (200, 400, 3, 40), (880, 650, 4, 50), (160, 600, 3, 45),
    (900, 500, 5, 55),
]:
    dot_color = (30, 139, 139, alpha)
    # Since we're in RGB mode, approximate with lighter teal
    ratio = alpha / 255
    blended = tuple(int(bg[j] * (1 - ratio) + teal[j] * ratio) for j in range(3))
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=blended)

# === LINK ===
text_center(content_top + 310, "my-reply.ru", f_reg_28, teal)

# === LOGO ===
my_t = "MY"
reply_t = "REPLY"
my_w = draw.textlength(my_t, font=f_bold_38)
reply_w = draw.textlength(reply_t, font=f_bold_38)
total_logo_w = my_w + reply_w
logo_x = W - total_logo_w - 60
logo_y = H - 90

draw.text((logo_x, logo_y), my_t, fill=navy, font=f_bold_38)
draw.text((logo_x + my_w, logo_y), reply_t, fill=teal, font=f_bold_38)

# Save
out = "D:/PROJECTS/MYREPLY/assets/myreply-hero-card.png"
img.save(out, "PNG")
print(f"Saved: {out}")
