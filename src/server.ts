import { PrismaClient } from "@prisma/client";
import fastify from "fastify";

const app = fastify()

const prisma = new PrismaClient()

interface PostDataUser {
  role: string;
  email: string;
}

interface PostDataPublication {
  title: string;
  post: string;
  userId: string;
}

app.get('/users/:userEmail', async (req) => {
  const { userEmail } = req.params as any
  const user = await prisma.user.findUnique({where: userEmail})

  return { user }
})

app.post('/users', async (req, reply) => {
  const { role, email } = req.body as PostDataUser;

  await prisma.user.create({
    data: {
      role,
      email,
    }
  })

  return reply.status(201).send();
})

app.get('/publications/:userId', async (req) => {
  const { userId } = req.params as any;

  const publications = await prisma.publication.findMany({
    where: {
      userId
    }
  })

  return { publications }
})

app.get('/publications/detail/:publicationId', async (req) => {
  const { publicationId } = req.params as any
  const publication = await prisma.publication.findUnique({where: {
    id: publicationId
  }})

  return { publication }
})

app.post('/publication/', async (req, reply) => {
  const { title, post, userId } = req.body as PostDataPublication;

  await prisma.publication.create({
    data: {
      title,
      post,
      userId
    }
  })

  return reply.status(201).send();
})

app.listen({
  host: '0.0.0.0',
  port: process.env.PORT ? Number(process.env.PORT) : 3333,
}).then(() => {
  console.log('HTTP Server running')
})
