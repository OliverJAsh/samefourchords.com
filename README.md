# samefourchords.com

## Usage

```
npm install
npm start
```

## Deploy

```
ssh -i ec2.pem ec2-user@52.21.34.140
```

```
cd samefourchords.com &&
git pull &&
killall node &&
PORT=8081 npm start &
```
