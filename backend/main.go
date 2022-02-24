package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/pusher/pusher-http-go"
)

type PusherObj struct {
	AppId   string
	Key     string
	Secret  string
	Cluster string
	Secure  bool
}

func main() {
	var PusherConf PusherObj
	PusherConf.AppId = "1352452"
	PusherConf.Key = "af61646bc041a9c203ec"
	PusherConf.Secret = "83d11e516246417a5ed4"
	PusherConf.Cluster = "ap1"
	PusherConf.Secure = true

	app := fiber.New()

	app.Use(cors.New())

	pusherClient := pusher.Client{
		AppID:   PusherConf.AppId,
		Key:     PusherConf.Key,
		Secret:  PusherConf.Secret,
		Cluster: PusherConf.Cluster,
		Secure:  PusherConf.Secure,
	}

	app.Post("/api/messages", func(c *fiber.Ctx) error {
		var data map[string]string

		if err := c.BodyParser(&data); err != nil {
			return err
		}

		pusherClient.Trigger("chat", "message", data)
		return c.JSON([]string{})
	})

	app.Listen(":8000")
}
