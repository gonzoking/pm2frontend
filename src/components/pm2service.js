import pm2 from 'pm2';

export const openPm2Session = () => {
    pm2.connect((err) => {
        if(err) {
            console.log('error connecting to pm2');
        }});
    pm2.disconnect();
}

export const pm2RunAction = (action, item) => {
    return new Promise((resolve, reject) => {
        pm2[action](item, (err) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

export const pm2LoadList = () => {
    return new Promise((resolve, reject) => {
        pm2.list((err, procceslist) => {
            if (err) {
                reject(err);
            }
            resolve(procceslist);
        });
    });
}