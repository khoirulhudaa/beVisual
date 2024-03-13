const visualModel = require('../Models/visualModel')
const crypto = require('crypto')
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const getAllVisual = async (req, res) => {
    try {
        
        const existVisual = await visualModel.find()
        if(!existVisual) return res.json({ status: 404, message: 'Dta visual tidak ada!' })

        return res.json({ status: 200, message: 'Berhasil abmil data visual!', data: existVisual })

    } catch (error) {
        return res.json({ status: 200, message: 'Server bermasalah!', error: error.message })
    }
}

const createVisual = async (req, res) => {
    try {
        const { title, description, uploader, link, type_dinas } = req.body

        const existVisual = await visualModel.findOne({ title })
        if (existVisual) {
            return res.status(404).json({ status: 404, message: 'User tidak ditemukan!' })
        }

        if (!req.file) {
            return res.status(404).json({ status: 404, message: 'Gambar belum di upload!' })
        }

        let logoNameCloud = null
        let logo = null 

        if (req.file) {
            const originalName = req.file.originalname;
            const randomChars = crypto.randomBytes(4).toString('hex');
            logoNameCloud = `${randomChars}_${originalName}`;
         
            // Menggunakan Promise untuk menunggu selesainya upload ke Cloudinary
            await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({ public_id: logoNameCloud }, (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        reject(error);
                    } else {
                        console.log('cloud result:', result);
                        logo = result.secure_url;
                        resolve();
                    }
                }).end(req.file.buffer);
            });
        } else {
            logo = 'defaultGroup.jpg'
        }

        const tokenRandom = crypto.randomBytes(5).toString('hex')

        const newData = {
            visual_id: tokenRandom,
            title,
            type_dinas,
            uploader,
            description,
            link,
            image: logo
        }

        const resultNewData = new visualModel(newData)
        await resultNewData.save()

        return res.status(200).json({ status: 200, message: 'Berhasil tambah data visual!', data: newData })

    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Server bermasalah!', error: error.message })
    }
}

const removeVisual = async (req, res) => {
    try {
        
        const { visual_id } = req.params

        const existVisual = await visualModel.findOneAndDelete({ visual_id })
        if(!existVisual) return res.json({ status: 404, message: 'Data visual tidak ditemukan!' })

        return res.json({ status: 200, message: "Berhasil menghapus data visual!" })

    } catch (error) {
        return res.json({ status: 500, message: 'Server bermasalah!', error: error });
    }
}

const updateVisual = async (req, res) => {
    try {

        const { visual_id, title, description, uploader, link, type_dinas } = req.body

        const existVisual = await visualModel.findOne({ visual_id })
        if(!existVisual) return res.json({ status: 404, message: 'Data visual tidak ditemukan!' })
        
        const updateFields = { title, description, uploader, link, type_dinas };
            
        if (req.file) {
            const originalName = req.file.originalname;
            const randomChars = crypto.randomBytes(4).toString('hex');
            logo = `${randomChars}_${originalName}`;

            try {
                await cloudinary.uploader.destroy(existVisual.image);
                await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream({ public_id: logo }, (error, result) => {
                        if (error) {
                            console.error('Cloudinary upload error:', error);
                            reject(error);
                        } else {
                            console.log('cloud result:', result);
                            updateFields.image = result.secure_url;
                            resolve();
                        }
                    }).end(req.file.buffer);
                });
            } catch (cloudinaryError) {
                console.error('Cloudinary upload error:', cloudinaryError);
                return res.json({ status: 500, message: 'Failed to update Group due to Cloudinary error!' });
            }
        }

        const updateGroup = await visualModel.findOneAndUpdate(
            { visual_id },
            { $set: updateFields },
            { new: true }
        );

        if (!updateGroup) {
            return res.json({ status: 500, message: 'Gagal perbarui data!' });
        }

        const resultNew = await visualModel.findOne({ visual_id })

        return res.json({ status: 200, message: 'Berhasil perbarui data!', data: resultNew });
        
    } catch (error) {
        return res.json({ status: 200, message: 'Server bermasalah!', message: error.message })
    }
}


module.exports = {
    createVisual,
    removeVisual,
    updateVisual,
    getAllVisual
}