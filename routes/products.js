const { Router } = require("express");
const router = Router();
const axios = require('axios');
const Auth = require("../middleware/Auth");

const cheerio = require('cheerio');

router.post("/scrap", Auth, async (req, res) => {
  let html = await getHTML(req.body.url)
  const $ = cheerio.load(html);
  let productTitle = $('#productTitle').html().trim()
  let rating = $('#acrPopover').attr('title')
  let ratingCount = $("#acrCustomerReviewText").html()
  
  let price = $("#apex_desktop .apexPriceToPay .a-offscreen").html()

  let productImages = $("#main-image-container ul li")
  let images = []
  
  // let altProductImages = $("#altImages ul li")
  // let altImages = []
  // data-old-hires

  productImages.each((index, el) => {
    let img = $(el).find('img')
    console.log(img);

    // let img = $(el).find('img').attr('src')
    // images.push(img)
    // if (img && img.includes('SS40_.jpg')) {
    //   altImages.push(
    //     {
    //       thumbnail: img,
    //       medium: img.replace('_SS40_.jpg', '_SX679_.jpg'),
    //       large: img.replace('_SS40_.jpg', '_SL1500_.jpg')
    //     })
    //     // 
    // }  
  })
  // for (let index = 0; index < productImages.length; index++) {
  //   // const element = array[index];
  //   console.log(index);
  // }
  
  // _SL1500_.jpg
  
  // data-old-hires

  res.status(200).send({
    title: productTitle,
    rating: rating,
    ratingCount: ratingCount,
    price: price,
    images: images,
    // altImages: altImages
  })
});


async function getHTML(url) {
  const { data: html } = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36'
    }
  })
    .catch(function (error) {
      console.log(error);
    });
  return html;
}

module.exports = router;
