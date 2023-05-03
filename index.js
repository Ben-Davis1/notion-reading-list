import { Client } from "@notionhq/client";
import Parser from "rss-parser";
import pkg from 'bluebird';
const {Promise} = pkg;

const parser = new Parser();
const notion = new Client({ auth: "secret_Un2kwxNi3p5i1m4qBYi8cF52M7GY0X3IP8AhvIAN22n" });


import express from "express"
const app = express()
const port = 3000

app.get('/ingest', async(req, res) => {
const createPage = async(title, link) => {
  await notion.pages.create({
    parent: {
      database_id: "882be6487eec49b89f1dbfa6b603b172",
    },
    properties: {
      "Summary": {
        type: 'title',
        title: [
          {
            type: 'text',
            text: {
              content: title,
            },
          },
        ],
      },
      "Status": {
        type: "select",
        select: {
          name: "Triage"
        }
      },
      "Type": {
        type: "select",
        select: {
          name: "Article"
        }
      },
      "Source": {
        type: "select",
        select: {
          name: "Daily.dev"
        }
      },
      "Link": {
        type: "url",
        url: link 
      },
    },
  });

  new Promise(r => setTimeout(r, 3000))
};

  let feed = await parser.parseURL("https://api.daily.dev/rss/b/3195204d-2ffa-431b-98b0-11ccb1b8f3cc");
  
  const bookmarks = feed.items

  Promise.map(bookmarks, bookmark => createPage(bookmark.title, bookmark.link.split("?")[0]), { concurrency: 1 })

  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
