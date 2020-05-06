const express = require("express");
const db = require("./db");
const router = express.Router();

router.get("/", (req, res) => {
    db.find(req.query)
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: "error retrieving posts"
        })
    })
})

router.get("/:id", (req, res) => {
    db.findById(req.params.id)
    .then(post => {
        console.log(post);
        if (post.length != 0) {
            res.status(200).json(post);
        }
        else {
            res.status(404).json({ message: "post not found"})
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: "error retrieving post"
        })
    })
})


router.post("/", (req, res) => {
    const post = req.body;
    if (!post.title || !post.contents) {
        res.status(400).json({message: "post needs title and contents"})
    }
    else {
        db.insert(req.body)
        .then(id => {
            console.log(id.id);
            db.findById(id.id)
            .then(post =>  {
                console.log(post);
                res.status(201).json(post);

            })
            .catch(err => {
                res.status(500).json({message: "error saving post"})
                })    
        })
        .catch(err => {
        res.status(500).json({message: "error saving post"})
        })    
    }
})

router.post("/:id/comments", (req, res) => {
    const comment = req.body;
    const id = req.params.id;
    comment.post_id = id;
    db.findById(id)
    .then(post => {

        if (!post){
            res.status(404).json({message: "post not found"})
        }
        else {
            console.log(comment);

            db.insertComment(comment)
            .then(commentID => {
                if(!comment.text) {
                    res.status(400).json({message: "comment must have text"})
                }
                else {
                    db.findCommentById(commentID.id)
                    .then(comment => {
                        res.status(200).json(comment);
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({message: "error retrieving comment"})
                    })

                }
            })
            .catch(err => {
                res.status(500).json({message: "error while saving comment"})
            })
        }
    })
    .catch(err => {
        res.status(500).json({message: "error retrieving post"})
    })
})

router.get("/:id/comments", (req, res) => {
    const id = req.params.id;
    db.findById(id)
    .then(post => {
        if (!post) {
            res.status(404).json({message: "post not found"});
        }
        else {
            db.findPostComments(id)
            .then(comments => {
                res.status(200).json(comments);
            })
            .catch(err => {
                res.status(500).json({message: "error retrieving comments"});
            })
        }
    })
})

router.delete("/:id", (req, res) => {
    
    db.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: "post has been removed" });
      } else {
        res.status(404).json({ message: "post could not be found" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "error removing the post",
      });
    });
})

router.put("/:id", (req, res) => {
    const changes = req.body;
    console.log(changes);
    if (!changes.title || !changes.contents){
        res.status(400).json({message: "provide title and contents"})
    }
    else {
        db.update(req.params.id,  changes)
    .then(count => {
        if (count != 1) {
            res.status(404).json({message: "post not found"})
        }
        else {
            res.status(200).json(req.body);
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({message: "error updating post"});
    })
    } 
    
    

})


module.exports = router;