# samefourchords.com

## Usage

```
npm install
npm start
```

## Deploy

```
git push
```

## Sync
```
aws s3 sync ~/Development/samefourchords.com-images/ s3://samefourchords.com-images --cache-control "max-age=31536000" --delete --dryrun
# OR
s3cmd sync ~/Development/samefourchords.com-images/ s3://samefourchords.com-images --add-header='Cache-Control':'max-age=31536000' --delete-removed --dry-run
```

## Add headers
```
s3cmd --recursive modify --add-header="Cache-Control: max-age=31536000" s3://samefourchords.com-images
```

## Create post

```
(id="2016-11-12-ampthill-park-and-luton-hoo" title="Ampthill Park and Luton Hoo"; rm -rf ./scripts/target/ && mkdir -p ./scripts/target && tsc --project ./scripts && node ./scripts/target/scripts/src/createPostCli.js $id $title  > ./server/src/posts/$id.json)
```
