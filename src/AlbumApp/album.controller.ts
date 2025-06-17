import { Request, Response } from "express"
import { AlbumService } from "./album.service"




export const AlbumController = {
    getAllAlbums: async function(req: Request, res: Response){
        const id = res.locals.userId
        const result = await AlbumService.getAllAlbums(+id)

        res.json(result)
    },

    changeAlbum: async function(req:  Request, res: Response){
        const id = req.params.id
        const data = req.body
        const result = await AlbumService.changeAlbum(data, +id)

        res.json(result)
    },

    addPhotoToAlbum: async function(req: Request, res: Response){
        const id = req.params.id
        const data = req.body
<<<<<<< Updated upstream
        console.log('standoff 2')
        const result = await AlbumService.addPhotoToAlbum(data, +id)
        console.log('result:' + result)
=======
        const result = await AlbumService.addPhotoToAlbum(data, +id)
>>>>>>> Stashed changes

        res.json(result)
    },

    createAlbum: async function(req: Request, res: Response){
        const id = res.locals.userId
        const data = req.body
        const result = await AlbumService.createAlbum(data, +id)

        res.json(result)
    }
}