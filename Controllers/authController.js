const authModel = require('../Models/authModel')
const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const crypto = require('crypto')

const getAllUser = async (req, res) => {
    try {
        
        const existUser = await authModel.find()
        if(!existUser) return res.json({ status: 404, message: 'Dta visual tidak ada!' })

        return res.json({ status: 200, message: 'Berhasil abmil data visual!', data: existUser })

    } catch (error) {
        return res.json({ status: 200, message: 'Server bermasalah!', error: error.message })
    }
}


const signin = async (req, res) => {
    try {

        const { email, password } = req.body

        const existUser = await authModel.findOne({ email })
        if(!existUser) return res.json({ status: 404, message: 'User tidak ditemukan!' })
       
        const isMatch = bcrypt.compare(password, existUser.password)
        if(!isMatch) return res.json({ status: 401, message: 'Kata sandi salah!' })

        const token = jsonwebtoken.sign({ user_id: existUser.email }, 'visual', { expiresIn: '5h' })

        return res.json({ status: 200, message: 'Berhasil masuk!', token, data: existUser })

    } catch (error) {
        return res.json({ status: 200, message: 'Server bermasalah!', error: error.message })
    }
}

const signup = async (req, res) => {
    try {
        const { email, password, username } = req.body
       
        const existUser = await authModel.findOne({ email })
        if(existUser) return res.json({ status: 400, message: 'Email sudah terpakai!' })
 
        const tokenRandom = crypto.randomBytes(6).toString('hex')
          
        const salt = await bcrypt.genSalt(10)
        const passwordHashGenerate = await bcrypt.hash(password, salt)

        const newuser = new authModel({
            user_id: tokenRandom,
            email,
            username,
            role: 'sub-admin',
            password: passwordHashGenerate,
        })

        await newuser.save()
        return res.json({ status: 200, message: 'Berhasil daftar anggota!' })

    } catch (error) {
        return res.json({ status: 500, message: 'Server bermasalah!', error: error });
    }
}

const removeUser = async (req, res) => {
    try {
        
        const { user_id } = req.params

        const existUser = await authModel.findOneAndDelete({ user_id })
        if(!existUser) return res.json({ status: 404, message: 'Anggota tidak ditemukan!' })

        return res.json({ status: 200, message: "Berhasil menghapus anggota!" })

    } catch (error) {
        return res.json({ status: 500, message: 'Server bermasalah!', error: error });
    }
}

const updateUser = async (req, res) => {
    try {

        const { user_id, username, email } = req.body
        
        const equalUser = await authModel.findOne({ user_id })
        if(!equalUser) return res.json({ status: 404, message: 'Anggota tidak ditemukan!' })

        let passwordHashGenerate

        if(req.body.password) {
            const salt = await bcrypt.genSalt(10)
            passwordHashGenerate = await bcrypt.hash(req.body.password, salt)
        }

        const filter = { user_id }

        const set = {
            username, 
            email,
            ...(req.body.password ? { password: passwordHashGenerate } : {})
        }

        const updateUser = await authModel.updateOne(filter, set, { new: true })
        if(!updateUser) return res.json({ status: 500, message: 'Gagal perbarui akun!', data: user_id })
        const resultNew = await authModel.findOne({ user_id })
        
        return res.json({ status: 200, message: 'Berhasil perbarui akun!', data: resultNew })

    } catch (error) {
        return res.json({ status: 500, message: 'Server bermasalah!', error: error });
    }
}

module.exports = {
    getAllUser,
    signin,
    signup,
    removeUser,
    updateUser
}