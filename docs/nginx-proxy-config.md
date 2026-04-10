# Nginx Reverse Proxy для my-reply.ru

## Шаг 1: DNS
Направить A-запись `my-reply.ru` на VPS IP: `195.161.41.131`

## Шаг 2: Nginx конфиг

```nginx
server {
    listen 80;
    server_name my-reply.ru www.my-reply.ru;

    location / {
        proxy_pass https://myreply.vercel.app;
        proxy_set_header Host my-reply.ru;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_ssl_server_name on;
        proxy_ssl_name myreply.vercel.app;
    }
}
```

## Шаг 3: SSL (Certbot)
```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d my-reply.ru -d www.my-reply.ru
```

## Шаг 4: Проверить
```bash
nginx -t && systemctl reload nginx
curl -I https://my-reply.ru
```
