# Mettre le site en ligne sur le VPS

À faire une seule fois. Ensuite, chaque fusion dans `main` met le site à jour toute seule
(et il reprend les nouvelles versions des outils toutes les 6 heures).

## 1. Le domaine

Chez OVH, dans la zone DNS de `ragnardrock.fr`, deux entrées vers l'adresse IP du VPS :

| Type | Sous-domaine | Cible |
|---|---|---|
| A | (vide) | l'IP du VPS |
| A | www | l'IP du VPS |

(Et `AAAA` pour l'IPv6 si le VPS en a une.)

## 2. Sur le VPS

```bash
# Le dossier du site
sudo mkdir -p /var/www/ragnardrock.fr
sudo chown $USER /var/www/ragnardrock.fr

# nginx et rsync (rsync sert à recevoir les fichiers)
sudo apt install nginx rsync

# La configuration du site
sudo cp nginx-ragnardrock.conf /etc/nginx/sites-available/ragnardrock.fr
sudo ln -s /etc/nginx/sites-available/ragnardrock.fr /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Le HTTPS (Let's Encrypt), une fois le DNS en place
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d ragnardrock.fr -d www.ragnardrock.fr
```

## 3. Une clé SSH réservée au déploiement

Sur ton PC (PowerShell) :

```powershell
ssh-keygen -t ed25519 -f "$HOME\.ssh\ragnardrock-deploiement" -N '""'
```

Ajoute le contenu de `ragnardrock-deploiement.pub` à la fin de `~/.ssh/authorized_keys` sur le VPS
(du compte propriétaire de `/var/www/ragnardrock.fr`).

## 4. Les secrets GitHub

Dépôt `ragnardrock-site` › Settings › Secrets and variables › Actions › New repository secret :

| Nom | Valeur |
|---|---|
| `VPS_HOTE` | l'adresse du VPS (IP ou nom) |
| `VPS_UTILISATEUR` | le compte SSH |
| `VPS_CLE` | le contenu de `ragnardrock-deploiement` (la clé privée, sans `.pub`) |
| `VPS_DOSSIER` | `/var/www/ragnardrock.fr` |
| `VPS_PORT` | seulement si SSH n'est pas sur le port 22 |

L'adresse et la clé restent dans ces secrets : elles n'apparaissent jamais dans le code.

## 5. Premier envoi

Onglet Actions › « Déployer le site » › Run workflow. Le site est en ligne une minute plus tard.

## Plus tard : le relais de Saga

Le relais pourra avoir son sous-domaine (par exemple `relais.ragnardrock.fr`) : une entrée DNS de plus
et un bloc `server` nginx qui renvoie vers le port du relais.
