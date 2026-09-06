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
  lastName?: string;
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
    lastName: "Касымова",
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
      {
        text: "Живот уже подводит, кто идёт перекусить бургер?",
        ageMinutes: 10,
        place: "Бургерная у Триумфа",
        plannedAt: "через 15 минут",
      },
    ],
  },
  {
    username: "daniyar91",
    name: "Данияр",
    lastName: "Бекенов",
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
      { text: "Взял велик напрокат, катаю по набережной — красота", ageMinutes: 25 },
    ],
  },
  {
    username: "asel_m",
    name: "Асель",
    lastName: "Жумабекова",
    city: "Алматы",
    vibe: "CALM",
    occupation: "Бухгалтер",
    bio: "Тишина — моя суперсила",
    contact: "@asel_almaty",
    vibeAgeHours: 5,
    posts: [
      { text: "Сижу дома с чаем, никуда не тороплюсь сегодня", ageMinutes: 180 },
      {
        text: "Гуляю с собакой в парке, никуда не спешим",
        ageMinutes: 60,
        place: "Парк Первого Президента",
      },
    ],
  },
  {
    username: "erlan_t",
    name: "Ерлан",
    lastName: "Токтаров",
    city: "Астана",
    vibe: "WORK",
    occupation: "Разработчик",
    vibeAgeHours: 3,
    posts: [{ text: "Дедлайн горит, сижу в кофейне с ноутом уже третий час", ageMinutes: 60 }],
  },
  {
    username: "madina_s",
    name: "Мадина",
    lastName: "Сериккызы",
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
    lastName: "Абенов",
    city: "Алматы",
    vibe: "DRAINED",
    occupation: "Таксист",
    vibeAgeHours: 4,
    posts: [
      { text: "Выжат как лимон после смены, хочу просто тишины", ageMinutes: 200 },
      { text: "Мама приболела, весь день у неё, самому тяжко", ageMinutes: 220 },
    ],
  },
  {
    username: "sabina_z",
    name: "Сабина",
    lastName: "Заманова",
    city: "Астана",
    vibe: "CALM",
    bio: "Читаю, гуляю, никуда не спешу",
    vibeAgeHours: 6,
    posts: [{ text: "Гуляю не спеша по набережной, красота вечером", ageMinutes: 240 }],
  },
  {
    username: "timur_k",
    name: "Тимур",
    lastName: "Кенжебаев",
    city: "Астана",
    vibe: "MOVE",
    occupation: "Фотограф",
    contact: "@timur_photo",
    vibeAgeHours: 2,
    posts: [
      { text: "Свободен весь вечер, ищу с кем зависнуть в центре", ageMinutes: 50 },
      {
        text: "Иду на концерт вечером, ищу кто со мной",
        ageMinutes: 45,
        place: "Дворец Независимости",
        plannedAt: "в 19:00",
      },
    ],
  },
  {
    username: "zhanna_a",
    name: "Жанна",
    lastName: "Абдуллина",
    city: "Астана",
    vibe: "CALM",
    occupation: "Учитель",
    vibeAgeHours: 8,
    posts: [{ text: "Заварила кофе, смотрю в окно — хороший тихий вечер", ageMinutes: 300 }],
  },
  {
    username: "alibek_d",
    name: "Алибек",
    lastName: "Досжанов",
    city: "Алматы",
    vibe: "WORK",
    occupation: "Менеджер проектов",
    vibeAgeHours: 3,
    posts: [
      { text: "Весь день на созвонах, но задача наконец интересная", ageMinutes: 100 },
      { text: "Проверяю контрольные всю ночь, кофе уже не спасает", ageMinutes: 80 },
    ],
  },
  {
    username: "karina_o",
    name: "Карина",
    lastName: "Оспанова",
    city: "Астана",
    vibe: "MOVE",
    bio: "Ищу приключения по вечерам",
    vibeAgeHours: 1,
    posts: [{ text: "Только выспалась, полна энергии — го гулять в парк, @daniyar91?", ageMinutes: 30 }],
  },
  {
    username: "rustam_n",
    name: "Рустам",
    lastName: "Нургалиев",
    city: "Астана",
    vibe: "WORK",
    occupation: "Юрист",
    vibeAgeHours: 5,
    posts: [{ text: "В офисе допоздна, зато почти закрыл важный кейс", ageMinutes: 150 }],
  },
  {
    username: "dinara_y",
    name: "Динара",
    lastName: "Ыдырысова",
    city: "Алматы",
    vibe: "CALM",
    occupation: "Дизайнер",
    vibeAgeHours: 10,
    posts: [
      { text: "Ничего не хочу, просто наслаждаюсь тишиной дома", ageMinutes: 400 },
      { text: "Купила новую куртку, теперь хочу дефилировать по проспекту", ageMinutes: 50 },
    ],
  },
  {
    username: "yerbol_s",
    name: "Ербол",
    lastName: "Сатыбалдиев",
    city: "Астана",
    vibe: "DRAINED",
    occupation: "Строитель",
    vibeAgeHours: 2,
    posts: [{ text: "День был тяжёлый, сил ни на что не осталось", ageMinutes: 70 }],
  },
  {
    username: "aliya_r",
    name: "Алия",
    lastName: "Рахимова",
    city: "Астана",
    vibe: "CALM",
    bio: "Люблю тишину и хороший чай",
    contact: "@aliya_r",
    vibeAgeHours: 12,
    posts: [{ text: "Хочу тишины и никаких сообщений сегодня", ageMinutes: 500 }],
  },
  {
    username: "daniyar_o",
    name: "Данияр",
    lastName: "Оспанов",
    city: "Астана",
    vibe: "WORK",
    occupation: "Бухгалтер",
    vibeAgeHours: 4,
    posts: [
      { text: "Закрываю отчёт, сегодня без движа", ageMinutes: 130 },
      { text: "Третий час кручу телефон, сна ни в одном глазу", ageMinutes: 15 },
    ],
  },
  {
    username: "asylzhan_p",
    name: "Асылжан",
    lastName: "Пернебаев",
    city: "Астана",
    vibe: "MOVE",
    occupation: "Тренер по кроссфиту",
    bio: "Ищу партнёра на утреннюю тренировку",
    vibeAgeHours: 1,
    posts: [
      {
        text: "Ищу напарника на пробежку, погода отличная",
        ageMinutes: 20,
        place: "Набережная Есиль",
        plannedAt: "через 10 минут",
      },
    ],
  },
  {
    username: "gaukhar_i",
    name: "Гаухар",
    lastName: "Испаева",
    city: "Астана",
    vibe: "CALM",
    occupation: "Ветеринар",
    bio: "После работы гуляю с питомцами клиентов",
    vibeAgeHours: 3,
    posts: [{ text: "Забрала домой щенка на передержку, вечер теперь с ним", ageMinutes: 90 }],
  },
  {
    username: "arman_zh",
    name: "Арман",
    lastName: "Жаксыбеков",
    city: "Шымкент",
    vibe: "WORK",
    occupation: "Студент",
    bio: "Сессия, готовлюсь к экзаменам",
    vibeAgeHours: 2,
    posts: [{ text: "Готовлюсь к экзамену, библиотека закрывается в 22", ageMinutes: 60 }],
  },
  {
    username: "dana_t",
    name: "Дана",
    lastName: "Тлеубердиева",
    city: "Караганда",
    vibe: "DRAINED",
    occupation: "Медсестра",
    bio: "Сутки в больнице выматывают",
    vibeAgeHours: 3,
    posts: [{ text: "Отработала сутки, еле держусь на ногах", ageMinutes: 30 }],
  },
  {
    username: "bekzat_o",
    name: "Бекзат",
    lastName: "Оразбаев",
    city: "Актобе",
    vibe: "MOVE",
    occupation: "Музыкант",
    bio: "Играю на гитаре в баре по выходным",
    vibeAgeHours: 1,
    posts: [
      {
        text: "Сегодня выступление в баре, потом хочется погулять по городу",
        ageMinutes: 15,
        place: "Бар Old Fashion",
        plannedAt: "после 22:00",
      },
    ],
  },
];

async function main() {
  console.log("Очищаю таблицы...");
  await prisma.commentLike.deleteMany();
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
      lastName: "Демеубаева",
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
        lastName: u.lastName,
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
  const createdComments = [];
  for (let i = 0; i < createdPosts.length; i++) {
    const post = createdPosts[i];
    if (i % 2 === 0) continue;

    const likers = allUsers.filter((u) => u.id !== post.authorId).slice(0, (i % 4) + 1);
    for (const liker of likers) {
      await prisma.like.create({ data: { userId: liker.id, postId: post.id } });
    }

    if (i % 3 === 0) {
      const eligibleCommenters = allUsers.filter((u) => u.id !== post.authorId);
      const commenter = eligibleCommenters[commentIndex % eligibleCommenters.length];
      if (commenter) {
        const comment = await prisma.comment.create({
          data: {
            authorId: commenter.id,
            postId: post.id,
            text: commentTexts[commentIndex % commentTexts.length],
            createdAt: minutesAgo(5),
          },
        });
        createdComments.push(comment);
        commentIndex++;
      }
    }
  }

  console.log("Добавляю лайки на комментарии...");
  for (let i = 0; i < createdComments.length; i++) {
    if (i % 2 !== 0) continue;
    const comment = createdComments[i];
    const likers = allUsers.filter((u) => u.id !== comment.authorId).slice(0, (i % 3) + 1);
    for (const liker of likers) {
      await prisma.commentLike.create({ data: { userId: liker.id, commentId: comment.id } });
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
