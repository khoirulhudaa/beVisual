const dinasModel = require('../Models/dinasModel')
const crypto = require('crypto')

const getAllDinas = async (req, res) => {
    try {
        
        const existdinas = await dinasModel.find()
        if(!existdinas) return res.json({ status: 404, message: 'Dta dinas tidak ada!' })

        return res.json({ status: 200, message: 'Berhasil abmil data dinas!', data: existdinas })

    } catch (error) {
        return res.json({ status: 200, message: 'Server bermasalah!', error: error.message })
    }
}

const createDinas = async (req, res) => {
    try {
        const { dinas_name } = req.body

        const existdinas = await dinasModel.findOne({ dinas_name })
        if (existdinas) {
            return res.status(404).json({ status: 404, message: 'Dinas sudah ada!' })
        }

        const tokenRandom = crypto.randomBytes(5).toString('hex')

        const newData = {
            dinas_id: tokenRandom,
            dinas_name,
        }

        const resultNewData = new dinasModel(newData)
        await resultNewData.save()

        return res.status(200).json({ status: 200, message: 'Berhasil tambah data dinas!', data: newData })

    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Server bermasalah!', error: error.message })
    }
}

const removedinas = async (req, res) => {
    try {
        
        const { dinas_id } = req.params

        const existdinas = await dinasModel.findOneAndDelete({ dinas_id })
        if(!existdinas) return res.json({ status: 404, message: 'Data dinas tidak ditemukan!' })

        return res.json({ status: 200, message: "Berhasil menghapus data dinas!" })

    } catch (error) {
        return res.json({ status: 500, message: 'Server bermasalah!', error: error });
    }
}

const updateDinas = async (req, res) => {
    try {

        const { dinas_id, dinas_name } = req.body

        const existdinas = await dinasModel.findOne({ dinas_id })
        if(!existdinas) return res.json({ status: 404, message: 'Data dinas tidak ditemukan!' })
        
        const updateFields = { dinas_name };
         

        const updateGroup = await dinasModel.findOneAndUpdate(
            { dinas_id },
            { $set: updateFields },
            { new: true }
        );

        if (!updateGroup) {
            return res.json({ status: 500, message: 'Gagal perbarui data!' });
        }

        const resultNew = await dinasModel.findOne({ dinas_id })

        return res.json({ status: 200, message: 'Berhasil perbarui data!', data: resultNew });
        
    } catch (error) {
        return res.json({ status: 200, message: 'Server bermasalah!', message: error.message })
    }
}


module.exports = {
    createDinas,
    removedinas,
    updateDinas,
    getAllDinas
}