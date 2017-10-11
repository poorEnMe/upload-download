const multiparty = require('multiparty');
const path = require('path');
const fs = require('fs');
const join = path.join;


let photoArray = [];
const Photo = require('../models/Photo');


photoArray.push({
    name:"Node.js Logo",
    path:"http://nodejs.org/images/logos/nodejs-green.png"
});

exports.list = (req,res)=>{
    Photo.find({},(err,photos)=>{
        if(err) return next(err);

        res.render('photos',{
            title:'Photos',
            photos:photos
        });
    });
};

exports.form = (req,res)=>{
    res.render('upload',{
        title:'photo upload'
    });
};

exports.submit = (dir) =>{
    /*return (req,res,next)=>{
        console.log(req.body);
        let img = req.files.photo.image;
        let name = req.body.photo.name || img.name;
        let path = join(dir,img.name);

        console.log(555);
        fs.rename(img.path,path,(err)=>{
            if(err) return next(err);

            Photo.create({
                name:name,
                path:img.name
            },(err)=>{
                if(err) return next(err);

                res.redirect('/');
            })

        })

    }*/
    return (req,res,next)=>{
        let form = new multiparty.Form({
            //encoding:'utf-8'
            uploadDir:dir
        });
        form.parse(req,(err,fields,file)=>{
            console.log(file);
            console.log(fields['newName'][0]);
            console.log(fields);
            if(err){
                console.log(err)
            }else{
                let img = file['inputPhoto'][0];
                let name = fields['newName'][0] || img.originalFilename;
                let newPath = join(dir,name);
                console.log(newPath);

                fs.rename(img.path,newPath,(err)=>{
                    if(err) return next(err);

                    Photo.create({
                        name:name,
                        path:name
                    },(err)=>{
                        if(err) return next(err);
                        res.redirect('/');
                    });
                });
            }

        })
    }
};


exports.download = (dir)=>{
    return (req,res,next)=>{
        let id = req.params.id;
        Photo.findById(id,(err,photo)=>{
            if(err) return next(err);
            let downloadPath =  join(dir,photo.path);
            res.download(downloadPath,photo.path+'.jpg',(err)=>{
                if(err) return next(err);
            });
        })
    }
};


