# MyReply Domain Recovery

Current verified state on 2026-06-29:

- Vercel production is healthy: `https://myreply.vercel.app`
- Vercel aliases include `my-reply.ru` and `www.my-reply.ru`
- DNS for both `my-reply.ru` and `www.my-reply.ru` points to Jino VPS `195.161.41.131`
- The Jino VPS currently returns `403` for `https://my-reply.ru`

## Preferred Fix: Point DNS Directly To Vercel

Use this if the Russian reverse proxy is not strictly required.

In Jino DNS, set:

```dns
my-reply.ru.      A      76.76.21.21
www.my-reply.ru.  CNAME  cname.vercel-dns.com.
```

Remove old `A` records for:

```dns
my-reply.ru.      A      195.161.41.131
www.my-reply.ru.  A      195.161.41.131
```

Then verify:

```bash
nslookup my-reply.ru
nslookup www.my-reply.ru
curl -I https://my-reply.ru
curl -I https://www.my-reply.ru
```

Expected:

- `my-reply.ru` resolves to `76.76.21.21`
- `www.my-reply.ru` resolves through Vercel DNS
- both URLs return `200` or a Vercel-managed redirect to the canonical domain

## Fallback Fix: Keep Jino VPS As Reverse Proxy

Use this only if the domain must keep routing through the Russian VPS.

Create or replace the nginx site config for MyReply:

```nginx
server {
    listen 80;
    server_name my-reply.ru www.my-reply.ru;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name my-reply.ru www.my-reply.ru;

    ssl_certificate /etc/letsencrypt/live/my-reply.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/my-reply.ru/privkey.pem;

    location / {
        proxy_pass https://myreply.vercel.app;
        proxy_http_version 1.1;

        proxy_set_header Host my-reply.ru;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_ssl_server_name on;
        proxy_ssl_name myreply.vercel.app;

        proxy_buffering off;
        proxy_read_timeout 120s;
        proxy_send_timeout 120s;
    }
}
```

If certificates are missing or broken:

```bash
apt update
apt install -y certbot python3-certbot-nginx
certbot --nginx -d my-reply.ru -d www.my-reply.ru
```

Validate and reload:

```bash
nginx -t
systemctl reload nginx
curl -I https://my-reply.ru
curl -I https://www.my-reply.ru
curl -I -X POST https://my-reply.ru/api/challenge
```

Expected:

- `nginx -t` succeeds
- GET routes return `200`
- POST routes do not return nginx `403`

## Vercel Reference

Current production deployment can be inspected with:

```bash
vercel inspect https://myreply.vercel.app
vercel domains inspect my-reply.ru
```
