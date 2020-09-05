const express = require("express");
const app = express();

const fs = require("fs");
const ytdl = require("ytdl-core");


app.use(express.static('public'))
app.use(express.json()); // recognize jason object
app.use(express.urlencoded({extended:true}));
app.set("view engine","hbs");
app.set('views','views'); // make sure express looks for views folder(optional, just to be safe)

var currentYear = new Date().getFullYear();


app.get("/",(req,res) => {
  res.render("index", {
    _mainMessage:"Enter a youtube link above to download, an invalid link will not be accepted",
  });
})

app.post("/", async (req,res) => {
  var url = "" + req.body.input_field; // stringfy everything in case of any tag injection

  try {
    const info = await ytdl.getBasicInfo(url);
    title = info.player_response.videoDetails.title.replace(/\s/g,"");

    res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
    const a = ytdl(url, {
      format: 'mp4',
    }).pipe(res);

  } catch(err) {
    return;
  }


});

// async function processURL(url,res) {
//   try {
//     const info = await ytdl.getBasicInfo(url);
//     title = info.player_response.videoDetails.title.replace(/\s/g,"");
//     console.log("title is",title);
//     res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
// 		ytdl(url, {
// 			format: 'mp4',
// 		}).pipe(res);
//   } catch(err) {
//     console.log("error is...", err);
//     res.render("index");
//   }
// }






var port = process.env.PORT || 4000;

app.listen(port,()=> {
  console.log(`Listening to port ${port}`);
});
