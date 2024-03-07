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
        const { title, description } = req.body

        const existVisual = await visualModel.findOne({ title })
        if (existVisual) {
            return res.status(404).json({ status: 404, message: 'User tidak ditemukan!' })
        }

        if (!req.file) {
            return res.status(404).json({ status: 404, message: 'Gambar belum di upload!' })
        }

        const result = await cloudinary.uploader.upload(req.file.path);

        const newData = {
            title,
            uploader,
            description,
            image: result.secure_url
        }

        const resultNewData = new visualModel(newData)
        await resultNewData.save()

        return res.status(200).json({ status: 200, message: 'Berhasil tambah data visual!', data: existVisual })

    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Server bermasalah!', error: error.message })
    }
}

const removeVisual = async (req, res) => {
    try {
        
        const { visual_id } = req.body

        const existVisual = await visualModel.findOneAndDelete({ visual_id })
        if(!existVisual) return res.json({ status: 404, message: 'Data visual tidak ditemukan!' })

        return res.json({ status: 200, message: "Berhasil menghapus data visual!" })

    } catch (error) {
        return res.json({ status: 500, message: 'Server bermasalah!', error: error });
    }
}

const updateVisual = async (req, res) => {
    try {

        const { visual_id, title, description } = req.body

        const existVisual = await visualModel.findOne({ visual_id })
        if(!existVisual) return res.json({ status: 404, message: 'Data visual tidak ditemukan!' })
            
        const filter = { visual_id }
        let nameImage = null
        let imageVisual = null

        if(req.file) {

            const originameName = req.file.filename
            const tokenRandon = crypto.randomBytes(5).toString('hex')
            nameImage = `${tokenRandon}_${originameName}`

            try {
                await cloudinary.uploader.destroy(existVisual.image);
                await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream({ public_id: nameImage }, (error, result) => {
                        if (error) {
                            console.error('Pengiriman gambar ke cloudinary gagal:', error);
                            reject(error);
                        } else {
                            console.log('Hsil:', result);
                            imageVisual = result.secure_url;
                            resolve();
                        }
                    }).end(req.file.buffer);
                });
            } catch (cloudinaryError) {
                console.error('Pengiriman gambar ke cloudinary gagal!:', cloudinaryError);
                return res.json({ status: 500, message: 'Proses perbarui cloudinary gagal!' });
            }

        } else {
            imageVisual = 'default.jpg'
        }
        
        const set = {
            title,
            description
        }

        const updateUser = await visualModel.updateOne(filter, set, { new: true })
        if(!updateUser) return res.json({ status: 500, message: 'Gagal perbarui data visual!', data: visual_id })
        const resultNew = await visualModel.findOne({ visual_id })
        
        return res.json({ status: 200, message: 'Berhasil perbarui data visual!', data: resultNew })
        
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