// 引用 dotenv 讀取 .env
import axios from 'axios'
import 'dotenv/config'
// 引用 linebot
import linebot from 'linebot'

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

// bot.on('message', event => {
//   if (event.message.type === 'text') {
//     event.reply(event.message.text)
//   }
// })

// const { data } = await axios.get('https://data.coa.gov.tw/Service/OpenData/TransService.aspx?UnitId=IFJomqVzyB0i')
// console.log(data[0]['寵物名'])

bot.on('message', async event => {
  if (event.message.type === 'text') {
    try {
      const { data } = await axios.get('https://data.coa.gov.tw/Service/OpenData/TransService.aspx?UnitId=IFJomqVzyB0i')
      for (const info of data) {
        if (info['晶片號碼'] === event.message.text) {
          // event.reply([
          //   info['寵物名'],
          //   info['毛色'],
          //   info['飼主姓名'],
          //   info['連絡電話'],
          //   info['PICTURE'],
          // ])
          event.reply({
            type: 'flex',
            altText: 'animals',
            contents: {
              type: 'bubble',
              hero: {
                type: 'image',
                url: info['PICTURE'],
                size: 'full',
                aspectRatio: '20:13',
                aspectMode: 'cover',
                action: {
                  type: 'uri',
                  uri: info['PICTURE']
                }
              },
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: info['寵物名'],
                    weight: 'bold',
                    size: 'xl'
                  },
                  {
                    type: 'box',
                    layout: 'vertical',
                    margin: 'lg',
                    spacing: 'sm',
                    contents: [
                      {
                        type: 'box',
                        layout: 'baseline',
                        spacing: 'sm',
                        contents: [
                          {
                            type: 'text',
                            text: '毛色',
                            color: '#aaaaaa',
                            size: 'md',
                            flex: 5
                          },
                          {
                            type: 'text',
                            text: info['毛色'],
                            wrap: true,
                            color: '#666666',
                            size: 'sm',
                            flex: 10
                          }
                        ]
                      },
                      {
                        type: 'box',
                        layout: 'baseline',
                        spacing: 'sm',
                        contents: [
                          {
                            type: 'text',
                            text: '飼主姓名',
                            color: '#aaaaaa',
                            size: 'md',
                            flex: 5
                          },
                          {
                            type: 'text',
                            text: info['飼主姓名'],
                            wrap: true,
                            color: '#666666',
                            size: 'sm',
                            flex: 10
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              footer: {
                type: 'box',
                layout: 'vertical',
                spacing: 'sm',
                contents: [
                  {
                    type: 'button',
                    style: 'link',
                    height: 'sm',
                    action: {
                      type: 'message',
                      label: info['連絡電話'],
                      text: info['連絡電話']
                    }
                  }
                ],
                flex: 0
              }
            }
          })
          return
        }
        // console.log(info['寵物名'])
      }
      event.reply('找不到')
    } catch (error) {
      console.log(error)
      event.reply('發生錯誤')
    }
  }
})

bot.listen('/', process.env.PORT || 3000, () => {
  console.log('機器人啟動')
})
