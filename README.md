# Health Scale Digital - Static Website

A self-hosted static website for Health Scale Digital, a healthcare performance marketing agency. This site can be deployed to GitHub Pages, Netlify, Vercel, or any web server.

## Quick Start

### Option 1: GitHub Pages (Free Hosting)

1. Push this repository to GitHub
2. Go to repository **Settings** → **Pages**
3. Under "Source", select **main** branch and **/ (root)** folder
4. Click **Save**
5. Your site will be live at `https://yourusername.github.io/repository-name`

### Option 2: Netlify (Free Hosting)

1. Go to [netlify.com](https://netlify.com) and sign up
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub repository
4. Deploy settings are automatic for static sites
5. Click **Deploy**

### Option 3: Vercel (Free Hosting)

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **"New Project"**
3. Import your GitHub repository
4. Click **Deploy**

### Option 4: Any Web Server

Simply upload all files to your web server's public directory (e.g., `public_html`, `www`, or `htdocs`).

---

## File Structure

```
healthscale-digital/
├── index.html              # Main HTML file (edit content here)
├── README.md               # This file
├── assets/
│   ├── css/
│   │   └── styles.css      # All styling (edit colors, fonts, spacing)
│   ├── js/
│   │   └── main.js         # JavaScript for mobile menu & smooth scroll
│   └── images/
│       ├── logo-dark.png   # Logo for light backgrounds
│       ├── logo-light.png  # Logo for dark backgrounds
│       ├── team-sri.png    # Team member photos
│       ├── team-samuel.png
│       ├── team-jake.png
│       ├── team-stephen.png
│       └── team-jeetendra.png
```

---

## How to Edit Content

### Editing Text Content

Open `index.html` in any text editor. Each section is clearly marked with comments:

```html
<!-- 
============================================================
HERO SECTION
============================================================
-->
```

Simply find the section you want to edit and change the text between the HTML tags.

### Changing Colors

Open `assets/css/styles.css` and find the **CSS Variables** section at the top:

```css
:root {
    /* Primary blue color */
    --color-primary: #2B8AC4;
    
    /* Yellow/lime accent for buttons */
    --color-accent: #D4E157;
    
    /* Change these to update colors site-wide */
}
```

### Changing Fonts

The site uses Google Fonts. To change fonts:

1. Go to [fonts.google.com](https://fonts.google.com)
2. Select your fonts
3. Copy the `<link>` tag
4. Replace the font link in `index.html`
5. Update the font names in `styles.css`:

```css
:root {
    --font-heading: 'Your New Font', serif;
    --font-body: 'Your New Font', sans-serif;
}
```

### Adding/Removing Team Members

In `index.html`, find the Team Section. To add a member, copy this block:

```html
<div class="team__member">
    <div class="team__member-photo">
        <img src="assets/images/team-newperson.png" alt="Name">
    </div>
    <h3 class="team__member-name">Full Name</h3>
    <p class="team__member-role">Job Title</p>
</div>
```

To remove a member, delete their entire `<div class="team__member">...</div>` block.

### Updating the Contact Button

Find the CTA section in `index.html` and change the `href` attribute:

```html
<!-- Email link -->
<a href="mailto:info@healthscaledigital.com" class="btn btn--white">Contact Us</a>

<!-- Or link to a form -->
<a href="https://forms.google.com/your-form" class="btn btn--white">Contact Us</a>

<!-- Or link to a phone number -->
<a href="tel:+1234567890" class="btn btn--white">Contact Us</a>
```

---

## Custom Domain Setup

### GitHub Pages

1. Go to repository **Settings** → **Pages**
2. Under "Custom domain", enter your domain (e.g., `www.healthscaledigital.com`)
3. Add these DNS records at your domain registrar:

| Type  | Name | Value                          |
|-------|------|--------------------------------|
| CNAME | www  | yourusername.github.io         |
| A     | @    | 185.199.108.153               |
| A     | @    | 185.199.109.153               |
| A     | @    | 185.199.110.153               |
| A     | @    | 185.199.111.153               |

### Netlify

1. Go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Follow the DNS configuration instructions

### Vercel

1. Go to **Project Settings** → **Domains**
2. Add your domain
3. Follow the DNS configuration instructions

---

## Browser Support

This website supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome for Android)

---

## Performance Tips

1. **Optimize Images**: Use [TinyPNG](https://tinypng.com) to compress images
2. **Enable Caching**: Most hosting platforms handle this automatically
3. **Use CDN**: Netlify and Vercel include CDN by default

---

## Troubleshooting

### Images not loading
- Check that image file names match exactly (case-sensitive)
- Ensure images are in `assets/images/` folder

### Styles not applying
- Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check that `styles.css` path is correct in `index.html`

### Mobile menu not working
- Ensure `main.js` is loaded at the bottom of `index.html`
- Check browser console for JavaScript errors

---

## License

This website template is provided for Health Scale Digital's exclusive use.

---

## Support

For questions about this template, refer to the detailed comments in each file or consult a web developer.
