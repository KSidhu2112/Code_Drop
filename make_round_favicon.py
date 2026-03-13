from PIL import Image, ImageDraw
import os

def add_corners(im, rad):
    circle = Image.new('L', (rad * 2, rad * 2), 0)
    draw = ImageDraw.Draw(circle)
    draw.ellipse((0, 0, rad * 2 - 1, rad * 2 - 1), fill=255)
    
    alpha = Image.new('L', im.size, 255)
    w, h = im.size
    
    # Top-left
    alpha.paste(circle.crop((0, 0, rad, rad)), (0, 0))
    # Top-right
    alpha.paste(circle.crop((rad, 0, rad * 2, rad)), (w - rad, 0))
    # Bottom-left
    alpha.paste(circle.crop((0, rad, rad, rad * 2)), (0, h - rad))
    # Bottom-right
    alpha.paste(circle.crop((rad, rad, rad * 2, rad * 2)), (w - rad, h - rad))
    
    im.putalpha(alpha)
    return im

def process_favicon():
    source_path = "client/public/favocon.png"
    dest_client = "client/public/favicon.png"
    dest_admin = "admin/public/favicon.png"
    
    if not os.path.exists(source_path):
        print(f"Source file not found: {source_path}")
        return

    try:
        img = Image.open(source_path).convert("RGBA")
        
        # Resize to standard reasonable size if too huge, or keep it. 
        # Standard favicon sizes: 16, 32, 48, 64, 128...
        # Let's resize to 128x128 for good quality, then we can save.
        target_size = (128, 128)
        img = img.resize(target_size, Image.Resampling.LANCZOS)
        
        # Calculate radius (20% of width)
        radius = int(target_size[0] * 0.20)
        
        # Create rounded image using a mask
        # Create a mask
        mask = Image.new('L', target_size, 0)
        draw = ImageDraw.Draw(mask)
        # Draw rounded rectangle
        draw.rounded_rectangle([(0, 0), target_size], radius=radius, fill=255)
        
        # Apply mask
        output = Image.new('RGBA', target_size, (0, 0, 0, 0))
        output.paste(img, mask=mask)
        
        # Save
        output.save(dest_client, "PNG")
        output.save(dest_admin, "PNG")
        print(f"Saved rounded favicons to {dest_client} and {dest_admin}")
        
    except Exception as e:
        print(f"Error processing image: {e}")

if __name__ == "__main__":
    process_favicon()
