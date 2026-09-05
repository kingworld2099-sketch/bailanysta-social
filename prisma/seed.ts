import { PrismaClient, Vibe } from "@prisma/client";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient();

function hoursAgo(h: number) {
  return new Date(Date.now() - h * 60 * 60 * 1000);
}

function minutesAgo(m: number) {
  return new Date(Date.now() - m * 60 * 1000);
}

type SeedUser = {
  username: string;
  name: string;
  city: string;
  vibe: Vibe;
  occupation?: string;
  bio?: string;
  contact?: string;
  vibeAgeHours: number;
  posts: { text: string; ageMinutes: number; place?: string; plannedAt?: string }[];
};

const users: SeedUser[] = [
  {
    username: "aigerim_k",
    name: "Айгерим",
    city: "Астана",
    vibe: "MOVE",
    occupation: "Официантка",
    bio: "Люблю движ и новых людей",
    vibeAgeHours: 1,
    posts: [
      {
        text: "Только закрыла смену, ищу компанию на завтрак в центре",
        ageMinutes: 40,
        place: "Кофейня на Туран",
        plannedAt: "прямо сейчас",
      },
    ],
  },
  {
    username: "daniyar91",
    name: "Данияр",
    city: "Астана",
    vibe: "MOVE",
    occupation: "Курьер",
    vibeAgeHours: 2,
    posts: [
      {
        text: "Еду в центр, кто рядом — погнали гулять",
        ageMinutes: 90,
        place: "Хан Шатыр",
        plannedAt: "через полчаса",
      },
      { text: "Погода отличная, не хочу домой в такой вечер", ageMinutes: 20 },
    ],
  },
  {
    username: "asel_m",
    name: "Асель",
    city: "Алматы",
    vibe: "CALM",
    occupation: "Бухгалтер",
    bio: "Тишина — моя суперсила",
    contact: "@asel_almaty",
    vibeAgeHours: 5,
    posts: [{ text: "Сижу дома с чаем, никуда не тороплюсь сегодня", ageMinutes: 180 }],
  },
  {
    username: "erlan_t",
    name: "Ерлан",
    city: "Астана",
    vibe: "WORK",
    occupation: "Разработчик",
    vibeAgeHours: 3,
    posts: [{ text: "Дедлайн горит, сижу в кофейне с ноутом уже третий час", ageMinutes: 60 }],
  },
  {
    username: "madina_s",
    name: "Мадина",
    city: "Астана",
    vibe: "MOVE",
    occupation: "Барista",
    bio: "После смены — только движ",
    vibeAgeHours: 1,
    posts: [
      {
        text: "Закрыла смену, хочу куда-нибудь выбраться прямо сейчас",
        ageMinutes: 15,
        place: "Достык Plaza",
        plannedAt: "сейчас",
      },
    ],
  },
  {
    username: "nurlan_b",
    name: "Нурлан",
    city: "Алматы",
    vibe: "DRAINED",
    occupation: "Таксист",
    vibeAgeHours: 4,
    posts: [{ text: "Выжат как лимон после смены, хочу просто тишины", ageMinutes: 200 }],
  },
  {
    username: "sabina_z",
    name: "Сабина",
    city: "Астана",
    vibe: "CALM",
    bio: "Читаю, гуляю, никуда не спешу",
    vibeAgeHours: 6,
    posts: [{ text: "Гуляю не спеша по набережной, красота вечером", ageMinutes: 240 }],
  },
  {
    username: "timur_k",
    name: "Тимур",
    city: "Астана",
    vibe: "MOVE",
    occupation: "Фотограф",
    contact: "@timur_photo",
    vibeAgeHours: 2,
    posts: [{ text: "Свободен весь вечер, ищу с кем зависнуть в центре", ageMinutes: 50 }],
  },
  {
    username: "zhanna_a",
    name: "Жанна",
    city: "Астана",
    vibe: "CALM",
    occupation: "Учитель",
    vibeAgeHours: 8,
    posts: [{ text: "Заварила кофе, смотрю в окно — хороший тихий вечер", ageMinutes: 300 }],
  },
  {
    username: "alibek_d",
    name: "Алибек",
    city: "Алматы",
    vibe: "WORK",
    occupation: "Менеджер проектов",
    vibeAgeHours: 3,
    posts: [{ text: "Весь день на созвонах, но задача наконец интересная", ageMinutes: 100 }],
  },
  {
    username: "karina_o",
    name: "Карина",
    city: "Астана",
    vibe: "MOVE",
    bio: "Ищу приключения по вечерам",
    vibeAgeHours: 1,
    posts: [{ text: "Только выспалась, полна энергии — го гулять в парк", ageMinutes: 30 }],
  },
  {
    username: "rustam_n",
    name: "Рустам",
    city: "Астана",
    vibe: "WORK",
    occupation: "Юрист",
    vibeAgeHours: 5,
    posts: [{ text: "В офисе допоздна, зато почти закрыл важный кейс", ageMinutes: 150 }],
  },
  {
    username: "dinara_y",
    name: "Динара",
    city: "Алматы",
    vibe: "CALM",
    occupation: "Дизайнер",
    vibeAgeHours: 10,
    posts: [{ text: "Ничего не хочу, просто наслаждаюсь тишиной дома", ageMinutes: 400 }],
  },
  {
    username: "yerbol_s",
    name: "Ербол",
    city: "Астана",
    vibe: "DRAINED",
    occupation: "Строитель",
    vibeAgeHours: 2,
    posts: [{ text: "День был тяжёлый, сил ни на что не осталось", ageMinutes: 70 }],
  },
  {
    username: "aliya_r",
    name: "Алия",
    city: "Астана",
    vibe: "CALM",
    bio: "Люблю тишину и хороший чай",
    contact: "@aliya_r",
    vibeAgeHours: 12,
    posts: [{ text: "Хочу тишины и никаких сообщений сегодня", ageMinutes: 500 }],
  },
];

async function main() {
  console.log("Очищаю таблицы...");
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  console.log("Создаю демо-аккаунт...");
  const demoPasswordHash = await hashPassword("demo1234");
  const demo = await prisma.user.create({
    data: {
      username: "demo",
      name: "Аяна",
      city: "Астана",
      occupation: "Дизайнер",
      bio: "Захожу сюда после работы посмотреть, кто рядом на движе",
      contact: "@ayana_demo",
      passwordHash: demoPasswordHash,
      vibe: "CALM",
      vibeUpdatedAt: hoursAgo(2),
    },
  });

  const demoPosts = await Promise.all(
    [
      { text: "Всем привет! Ищу компанию на кофе в центре Астаны", ageMinutes: 45 },
      { text: "Вечер спокойный, сижу дома — но если что, пишите", ageMinutes: 300 },
    ].map((p) =>
      prisma.post.create({
        data: {
          authorId: demo.id,
          text: p.text,
          vibe: demo.vibe,
          createdAt: minutesAgo(p.ageMinutes),
        },
      })
    )
  );

  console.log("Создаю тестовых пользователей и посты...");
  const password = await hashPassword("password123");

  const createdUsers = [];
  const createdPosts = [...demoPosts];

  for (const u of users) {
    const user = await prisma.user.create({
      data: {
        username: u.username,
        name: u.name,
        city: u.city,
        occupation: u.occupation,
        bio: u.bio,
        contact: u.contact,
        passwordHash: password,
        vibe: u.vibe,
        vibeUpdatedAt: hoursAgo(u.vibeAgeHours),
      },
    });
    createdUsers.push(user);

    for (const p of u.posts) {
      const post = await prisma.post.create({
        data: {
          authorId: user.id,
          text: p.text,
          vibe: u.vibe,
          place: p.place,
          plannedAt: p.plannedAt,
          createdAt: minutesAgo(p.ageMinutes),
        },
      });
      createdPosts.push(post);
    }
  }

  console.log("Добавляю лайки и комментарии...");
  const allUsers = [demo, ...createdUsers];

  const commentTexts = [
    "О, я тоже рядом!",
    "Го, пиши в директ",
    "Понимаю это чувство",
    "Тоже сегодня такое настроение",
    "Красиво написал(а)",
    "Держись, скоро отпуск",
  ];

  let commentIndex = 0;
  for (let i = 0; i < createdPosts.length; i++) {
    const post = createdPosts[i];
    if (i % 2 === 0) continue;

    const likers = allUsers.filter((u) => u.id !== post.authorId).slice(0, (i % 4) + 1);
    for (const liker of likers) {
      await prisma.like.create({ data: { userId: liker.id, postId: post.id } });
    }

    if (i % 3 === 0) {
      const commenter = allUsers.find((u) => u.id !== post.authorId);
      if (commenter) {
        await prisma.comment.create({
          data: {
            authorId: commenter.id,
            postId: post.id,
            text: commentTexts[commentIndex % commentTexts.length],
            createdAt: minutesAgo(5),
          },
        });
        commentIndex++;
      }
    }
  }

  console.log(`Готово: ${allUsers.length} пользователей, ${createdPosts.length} постов.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
