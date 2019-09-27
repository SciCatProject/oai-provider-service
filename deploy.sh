#export DEPLOY_USER=""
git pull
npm run compile
rsync -e ssh -av ../oai-provider-service $DEPLOY_USER@doi.psi.ch:/tmp/
ssh $DEPLOY_USER@doi.psi.ch <<'ENDSSH'
#commands to run on remote host
sudo -i
kill -9 `cat oai-provider-service/dist/save_pid.txt`
rm oai-provider-service/dist/save_pid.txt
rm -rf oai-provider-service
mv /tmp/oai-provider-service .
cd oai-provider-service
cd dist
NODE_ENV=production
nohup node index > log.txt 2>&1 &
echo $! > save_pid.txt
ENDSSH
