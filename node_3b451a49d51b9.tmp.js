const tmi = require('tmi.js');
const nodemailer = require('nodemailer');
const sqlite3 = require('sqlite3').verbose();

const { channel, channel2, channel3, username, password, emailConfig } = require('./settings.json');

// Conexão com o banco de dados para os pontos
const db = new sqlite3.Database('C:\\Users\\rache\\OneDrive\\Área de Trabalho\\Bot_twitch\\points.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Conectado ao banco de dados de pontos.');
});

// Conexão com o banco de dados para os comandos personalizados
const dbCommands = new sqlite3.Database('comandos_chat.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Conectado ao banco de dados de comandos personalizados.');
});

// Criação da tabela se ela não existir para os pontos
db.run(`CREATE TABLE IF NOT EXISTS pontos (
  id INTEGER PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  pontos INTEGER DEFAULT 0
)`);

// Criação da tabela se ela não existir para os comandos personalizados
dbCommands.run(`CREATE TABLE IF NOT EXISTS comandos_chat (
  id INTEGER PRIMARY KEY,
  comando TEXT NOT NULL UNIQUE,
  resposta TEXT NOT NULL
)`);

// Mapa para armazenar comandos personalizados
const customCommands = new Map();

const options = {
  options: { debug: true },
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username,
    password
  },
  channels: [channel, channel2, channel3]
};

const client = new tmi.Client(options);
client.connect().catch(console.error);

// Configuração do transporte para envio de e-mail
const transporter = nodemailer.createTransport(emailConfig);

client.on('connected', () => {
  client.say(channel, 'A janta está pronta, A janta está pronta!!!');

  // Carregar comandos do banco de dados para a memória
  dbCommands.each("SELECT comando, resposta FROM comandos_chat", (err, row) => {
    if (err) {
      console.error(err.message);
      return;
    }
    customCommands.set(row.comando, row.resposta);
  });
});

client.on('message', (channel, user, message, self) => {
  if (self) return;

  // Adicionando um comando para permitir que moderadores e streamers adicionem comandos personalizados
  if ((user.mod || user.username === channel.replace('#', '')) && message.startsWith('+com')) {
    const args = message.split(' ');
    // Verifica se o comando tem o formato correto: +com !nome_do_comando resposta_associada
    if (args.length < 3 || !args[1].startsWith('!')) {
      client.say(channel, 'Formato inválido. Use +com !nome_do_comando resposta_associada');
      return;
    }
    const command = args[1].toLowerCase(); // Nome do comando
    const response = args.slice(2).join(' '); // Resposta associada
    // Armazena o novo comando personalizado no banco de dados
    dbCommands.run('INSERT INTO comandos_chat (comando, resposta) VALUES (?, ?)', [command, response], (err) => {
      if (err) {
        console.log(channel, `Erro ao adicionar o comando: ${err.message}`);
        return;
      }
      customCommands.set(command, response);
      client.say(channel, `Comando "${command}" adicionado com sucesso!`);
    });
  }

  // Adicionando um comando para permitir que moderadores e streamers removam comandos personalizados
  if ((user.mod || user.username === channel.replace('#', '')) && message.startsWith('-com')) {
    const args = message.split(' ');
    // Verifica se o comando tem o formato correto: -com nome_do_comando
    if (args.length !== 2) {
      client.say(channel, 'Formato inválido. Use -com nome_do_comando');
      return;
    }
    const command = args[1].toLowerCase(); // Nome do comando a ser removido
    // Verifica se o comando existe antes de tentar removê-lo
    if (customCommands.has(command)) {
      customCommands.delete(command);
      // Remove o comando do banco de dados
      dbCommands.run('DELETE FROM comandos_chat WHERE comando = ?', [command], (err) => {
        if (err) {
          client.say(channel, `Erro ao remover o comando: ${err.message}`);
          return;
        }
        client.say(channel, `Comando "${command}" removido com sucesso!`);
      });
    } else {
      client.say(channel, `O comando "${command}" não existe.`);
    }
  }

  // Executa comandos personalizados
  if (customCommands.has(message.toLowerCase())) {
    client.say(channel, customCommands.get(message.toLowerCase()));
  }

  //COMANDOS

  //salve

  if (message == 'salve') {
    client.say(channel, `@${user.username}, salve meu bom`);
  }

  //steam 

  if (message == '!steam') {
    client.say(channel, 'ID de Amigo : 110879874https://steamcommunity.com/id/toddstr619/')
  }

  //discord 

  if (message == '!discord') {
    client.say(channel, `Entrem no discord do ''TODDYYZ'' pra jogar junto e saber quando eu fico online. https://discord.gg/RM8KadT2HQ`)
  }

  //pix 

  if (message == '!pix') {
    client.say(channel, `E ai, gostando das streams? Um metodo legal de apoiar o streamer é pelo ''PIX'' , e o melhor de tudo com sua mensagem aparecendo na tela , por apenas 1,00! https://livepix.gg/toddyyz`)
  }

  //lurk

  if (message == '!lurk') {
    client.say(channel, `Quem quiser dar aquela ajuda , sempre deixando no lurkzin , deixando a live aberta sempre que começar , Hoje existe um app que faz isso automaticamente. (Isso ajuda em 100% o crescimento do streamer) https://chrome.google.com/webstore/detail/twitch-lurker/fkjghajhfjamfjcmdkbangbeogbagnjf`)
  }


  // Tabela com números e descrições
  const idTable = [
    { id: 201, description: '8D9Y29E4CE0869971E (key com ativação na GOG: https://www.gog.com/en/redeem) ' },
    { id: 202, description: 'V95VA69C6E2310983F  (key com ativação na GOG: https://www.gog.com/en/redeem) ' },
    { id: 203, description: 'K65Z4180BD58CEF81F  (key com ativação na GOG: https://www.gog.com/en/redeem) ' },
    { id: 204, description: 'AA22FC8559E1E217BF  (key com ativação na GOG: https://www.gog.com/en/redeem) ' },
    { id: 205, description: '04YE2-5Y4N0-VX2CD  (key com ativação na Steam: https://store.steampowered.com/account/redeemwalletcode) ' },
    { id: 206, description: 'NV03W-I5F5Z-NVYC9  (key com ativação na Steam: https://store.steampowered.com/account/redeemwalletcode)' },
    { id: 207, description: 'RXBWV-TCVWD-ARKKP  (key com ativação na Steam: https://store.steampowered.com/account/redeemwalletcode)' },
    { id: 208, description: 'L2XH6-883FJ-ZVH8K  (key com ativação na Steam: https://store.steampowered.com/account/redeemwalletcode)' },
    { id: 209, description: 'MLCEX-CDJT0-M4APN  (key com ativação na Steam: https://store.steampowered.com/account/redeemwalletcode)' },
    { id: 210, description: 'VW06T-3MNDB-DL8T3  (key com ativação na Steam: https://store.steampowered.com/account/redeemwalletcode)' },
    { id: 211, description: '6ZTRM-D4BJ2-GXF8Z  (key com ativação na Steam: https://store.steampowered.com/account/redeemwalletcode)' },
    { id: 212, description: 'L6G3T-V95B2-KDQZ9  (key com ativação na Steam: https://store.steampowered.com/account/redeemwalletcode)' },
    { id: 213, description: 'W7DQJ-B4A7H-WND6T  (key com ativação na Steam: https://store.steampowered.com/account/redeemwalletcode)' },
    { id: 214, description: '4VXVL-YTI2I-2ZNLR  (key com ativação na Steam: https://store.steampowered.com/account/redeemwalletcode)' },
    { id: 215, description: 'VAL9J-MTWG6-QJ2FI  (key com ativação na Steam: https://store.steampowered.com/account/redeemwalletcode)' },
    { id: 216, description: 'só pa testa  (key com ativação na Steam: https://store.steampowered.com/account/redeemwalletcode)' },
    { id: 301, description: 'Seu MELHOR mod de Dragon Ball Z Budokai Tenkaichi 3: https://drive.google.com/file/d/1S9jvHeuV49LVBuP23AFRI2KBbjDtDzOF/view?usp=sharing' },
    { id: 302, description: 'Seu modelo de discord: https://discord.new/yE6X35vQHda5 (caso alguma duvida enviar mensagem para "shin__ki" no discord)' },
  ];



  // Comando para enviar e-mail e comprar
  if (message.startsWith('!comprar')) {
    const args = message.split(' ');
    const userEmail = args[1];
    const desiredId = parseInt(args[2]); // Adicionado para obter o ID desejado a partir dos argumentos

    // Verifique se o usuário forneceu um e-mail e um ID válido
    if (userEmail && !isNaN(desiredId) && idTable.some((entry) => entry.id === desiredId)) {
      const cost = getCostForId(desiredId); // Função para obter o custo em pontos para o ID desejado

      // Verificar se o usuário tem pontos suficientes
      db.get('SELECT * FROM points WHERE username = ?', user.username.toLowerCase(), (err, row) => {
        if (err) {
          console.error(err.message);
          client.say(channel, `@${user.username}, ocorreu um erro ao verificar seus pontos.`);
        } else {
          const userPoints = row ? row.points : 0;
          if (userPoints >= cost) {
            // Descontar pontos do usuário
            const newPoints = userPoints - cost;
            const userString = String(user.username); // Garante que user.username seja uma string
            db.run('UPDATE points SET points = ? WHERE username = ?', newPoints, userString.toLowerCase(), (err) => {
              if (err) {
                console.error(err.message);
                client.say(channel, `@${userString}, ocorreu um erro ao descontar seus pontos.`);
              } else {
                // Configurar e enviar e-mail
                const mailOptions = {
                  from: 'btwitch011@gmail.com', // Seu endereço de e-mail
                  to: userEmail,
                  subject: 'Carlinhos Bot',
                  text: `Seu número é ${desiredId}. Descrição: ${idTable.find((entry) => entry.id === desiredId)?.description || 'Sem descrição'
                    }`, // Personalize conforme necessário
                };

                // Enviar e-mail
                transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                    console.error(error);
                    client.say(channel, `@${user}, ocorreu um erro ao enviar o e-mail.`);
                  } else {
                    console.log('Email enviado: ' + info.response);
                    client.say(channel, `@${user.username}, e-mail enviado com sucesso!`);
                  }
                });
              }
            });
          } else {
            client.say(channel, `@${user.username}, você não tem pontos suficientes para comprar este item.`);
          }
        }
      });
    } else {
      client.say(
        channel,
        `@${user.username}, por favor, forneça um endereço de e-mail válido e um ID válido da tabela.`
      );
    }
  }

  // Função para obter o custo em pontos para o ID desejado
  function getCostForId(desiredId) {
    switch (desiredId) {
      case 201:
        return 5000;
      case 202:
        return 5000;
      case 203:
        return 5000;
      case 204:
        return 5000;
      case 205:
        return 5000;
      case 206:
        return 5000;
      case 207:
        return 5000;
      case 208:
        return 5000;
      case 209:
        return 5000;
      case 210:
        return 5000;
      case 211:
        return 5000;
      case 212:
        return 5000;
      case 213:
        return 5000;
      case 214:
        return 5000;
      case 215:
        return 5000;
      case 216:
        return 1;
      case 301:
        return 500;
      case 302:
        return 500;
      default:
        return 0; // ID não reconhecido
    }
  }


  //femboy

  if (message == '!femboy') {
    client.say(channel, 'Sou mimado, afeminado, estressado, e esquisito Um pouco Otaku 🔰 Não gosto de beber 🍺 Não gosto de festa 🎉 Tenho PC gamer 🕹️ Procuro uma garota depressiva, fofinha e Otome pra namorar')
  }

  //lunabeuty
  if (message == "!lunabeauty") {
    client.say(channel, `@${user.username} Ué mas isso não é coisa de mulher ?, é pra quem quiser pra quem tem luta e quem tem fé, pra quem tem empoderamento e tá de pé, dança com a gente luna beauty e xamuel`)
  }

  //princesa

  if (message == '!princesa') {
    client.say(channel, `Princesa será sempre eterna 🐶👑🖤`);
  }

  //steve?

  if (message == '!steve?') {
    client.say(channel, 'que isso steve https://clips.twitch.tv/SuccessfulTardyMeerkatLeeroyJenkins-LIgA3CKUKz9af3gG')
  }
  //street ganha do fighter
  if (message == '!street') {
    client.say(channel, `@${user.username}, street ganha do fighetr mas fighter ganha do 6`);
  }


  //dados

  if (message == '!roll') {
    client.say(channel, `@${user.username} seu número é ${Math.floor(Math.random() * 6) + 1}!`);
  }

  //ping pong

  if (message == 'ping') {
    client.say(channel, `@${user.username}, pong`);
  }

  //rafael

  if (message == '@Rafael3790') {
    client.say(channel, `@${user.username}, Você quis dizer... a mais linda da twitch?`);
  }

  //Frame data da Marisa

  if (message == '!marisa') {
    client.say(channel, `@${user.username}, Site para o Frame Data da Marisa: https://wiki.supercombo.gg/w/Street_Fighter_6/Marisa `);
  }

  //Frame data da Aki

  if (message == '!aki') {
    client.say(channel, `@${user.username}, Site para o Frame Data da A.K.I: https://wiki.supercombo.gg/w/Street_Fighter_6/A.K.I. `);
  }

  //Frame data do Blanka

  if (message == '!blanka') {
    client.say(channel, `@${user.username}, Site para o Frame Data do Blanka: https://wiki.supercombo.gg/w/Street_Fighter_6/Blanka `);
  }


  //Frame data do Ken

  if (message == '!ken') {
    client.say(channel, `@${user.username}, Site para o Frame Data do Ken: https://wiki.supercombo.gg/w/Street_Fighter_6/Ken `);
  }


  //Frame data da kimberly


  if (message == '!kimberly') {
    client.say(channel, `@${user.username}, Site para o Frame Data da Kimberly: https://wiki.supercombo.gg/w/Street_Fighter_6/Kimberly `);
  }

  //Frame data da Cammy

  if (message == '!cammy') {
    client.say(channel, `@${user.username}, Site para o Frame Data da Cammy: https://wiki.supercombo.gg/w/Street_Fighter_6/Cammy `);
  }


  //Frame data da Chun-Li


  if (message == '!chunli') {
    client.say(channel, `@${user.username}, Site para o Frame Data da Chun-Li: https://wiki.supercombo.gg/w/Street_Fighter_6/Chun-Li `);
  }

  //Frame data da Lily

  if (message == '!lily') {
    client.say(channel, `@${user.username}, Site para o Frame Data da Lily: https://wiki.supercombo.gg/w/Street_Fighter_6/Lily `);
  }


  //Frame data do Luke

  if (message == '!luke') {
    client.say(channel, `@${user.username}, Site para o Frame Data do Luke: https://wiki.supercombo.gg/w/Street_Fighter_6/Luke `);
  }


  //Frame data do Dee Jay


  if (message == '!deejay') {
    client.say(channel, `@${user.username}, Site para o Frame Data do Dee Jay: https://wiki.supercombo.gg/w/Street_Fighter_6/Dee_Jay `);
  }

  //Frame data do Dhalsim


  if (message == '!dhalsim') {
    client.say(channel, `@${user.username}, Site para o Frame Data do Dhalsim: https://wiki.supercombo.gg/w/Street_Fighter_6/Dhalsim `);
  }

  //Frame data da Manon

  if (message == '!manon') {
    client.say(channel, `@${user.username}, Site para o Frame Data da Manon: https://wiki.supercombo.gg/w/Street_Fighter_6/Manon `);
  }


  //Frame data do Honda

  if (message == '!honda') {
    client.say(channel, `@${user.username}, Site para o Frame Data do Honda: https://wiki.supercombo.gg/w/Street_Fighter_6/Honda `);
  }

  //Frame data do Guile

  if (message == '!guile') {
    client.say(channel, `@${user.username}, Site para o Frame Data do Guile: https://wiki.supercombo.gg/w/Street_Fighter_6/Guile `);
  }

  //Frame data do Rashid

  if (message == '!rashid') {
    client.say(channel, `@${user.username}, Site para o Frame Data do Rashid: https://wiki.supercombo.gg/w/Street_Fighter_6/Rashid `);
  }

  //Frame data do Ryu

  if (message == '!ryu') {
    client.say(channel, `@${user.username}, Site para o Frame Data do Ryu: https://wiki.supercombo.gg/w/Street_Fighter_6/Ryu `);
  }


  //Frame data do Honda

  if (message == '!honda') {
    client.say(channel, `@${user.username}, Site para o Frame Data do Honda: https://wiki.supercombo.gg/w/Street_Fighter_6/Honda `);
  }


  //Frame data do Jamie

  if (message == '!jamie') {
    client.say(channel, `@${user.username}, Site para o Frame Data do Jamie: https://wiki.supercombo.gg/w/Street_Fighter_6/Jamie `);
  }


  //Frame data do JP

  if (message == '!jp') {
    client.say(channel, `@${user.username}, Site para o Frame Data do JP: https://wiki.supercombo.gg/w/Street_Fighter_6/JP `);
  }



  //Frame data do Zangief

  if (message == '!zangief') {
    client.say(channel, `@${user.username}, Site para o Frame Data do Zangief: https://wiki.supercombo.gg/w/Street_Fighter_6/Zangief `);
  }

  //Frame data da Juri

  if (message == '!juri') {
    client.say(channel, `@${user.username}, Site para o Frame Data da Juri: https://wiki.supercombo.gg/w/Street_Fighter_6/Juri `);
  }

  //Frame data

  if (message == '!framedata') {
    client.say(channel, `@${user.username}, Site para o Frame Data: https://wiki.supercombo.gg/w/Street_Fighter_6 `);
  }


  //Help

  if (message == '!help') {
    client.say(channel, `@${user.username}, https://carlinhosbot.netlify.app/help_bot `);
  }

  //cavalos

  if (message == '!cavalos') {
    client.say(channel, `@${user.username} eu dou a bunda pra varios homens, 2050 homens ejaculando na minha boca, 250 homens mijando na minha boca, ai cleide, cleide, o povo n quer saber de cartucho de carabina, o povo quer gozar na minha bunda, 2050 eleitores do PT comeram a minha bunda e gozaram dentro, vou bater o record mundial em dar a bunda, vou bater o record mundial em chupar homens, vou bater o record mundial em chupar cavalos, chupar cavalos e homens`);
  }

  //Elden Bling

  if (message == '!F') {
    client.say(channel, `@${user.username}, F Elden Bling `);
  }

  //Presidenteon

  if (message == '!presidente') {
    client.say(channel, `@presidentelp, OBRIGADO PRESIDENTELP `);
  }

  //NegoPlanador

  if (message == '!planador') {
    client.say(channel, `@NegoPlanador , Diario de um detento - racionais Mc:`);
    client.say(channel, `!sr https://www.youtube.com/watch?v=dGFxdmuDA4A `)
  }
  //sus

  if (message == '!sus') {
    client.say(channel, `@${user.username}, Vocês precisam calar a porra dessa boca e parar de falar sobre Among Us. Ontem eu tava no banheiro tentando bater uma, e quando eu olhei pra cabeça do meu pau, eu pensei “hehe, parece com o personagem do Among Us.” “Haha, meu pau é sus.” E vocês sabem o que aconteceu?? Eu perdi a minha ereção. EU PERDI A PORRA DA MINHA EREÇÃO, POR CAUSA DE VOCÊS, QUE NÃO PARAM DE FALAR DESSE JOGO. PUTA QUE PARIU O QUE VOCÊS FIZERAM COM O MEU CÉREBRO SEUS BANDO DE FILHA DA PUTA EU ODEIO TODOS VOCÊS `);

  }

  //transformers

  if (message == '!transformers') {
    client.say(channel, `@${user.username}, Optmus prime é o melhor
    Com aquela espada gigantesca dele
    Atravessando a minha garganta e soltando o petróleo
    Na minha boca
    Fiquei sem graça e mandei parar
    Até que o optmus prime disse: aguente mais um pouco
    Me virei para ele
    E ele enfiou a sua grande espada
    Atravessando meu ânus
    Fiquei sem reação
    Gritei desesperado para os lados a procura de algo para segurar
    Porque a espada dele era tão enorme que eu não tinha forças para aguentar
    Mas ele não parava
    Até que...
    Ele tinha depositado todo seu petróleo em mim
    Depois de 8 meses
    Nasceu o Bumblebee`)
  }

  //reboco

  if (message == '!reboco') {
    client.say(channel, `@${user.username}, Receita de reboco. Misture quatro carrinhos de areia fina com um saco de cimento e dois sacos de cal.Adicione água, misturando até obter uma massa homogénea.Com uma colher de pedreiro, jogue a massa na parede, espere a massa puxar e faça o corte da massa com uma régua de pedreiro, deixando uma camada uniforme sobre a parede.Com o auxílio de uma broxa e de uma desempenadeira, tire as imperfeições da massa.Por fim, use um bloco de espuma úmido para dar o acabamento final `);
  }

  //golpe

  if (message == '!warner') {
    client.say(channel, `@${user.username}, Olá, sou gerente de recrutamento da Warner Media. como vai você? Você está procurando outra fonte ainda de renda?Nossa empresa trabalha com profissionais de marketing do Tik Tok que estão dispostos a pagar para aumentar a visibilidade, então precisamos contratar muitos colegas de trabalho para curtir o conteúdo do Tik Tok e pagamos R$ 3 por like, depende de você, quão livre você for, você ganhará mais mais de R$ 500 por dia. Você está interessado em trabalhar conosco? `);
  }

  //gacha

  if (message == '!gacha') {
    client.say(channel, `@${user.username}, Eca gacha, sai fora com esses jogo aí, vira essa boca pra lá 🤢🤮🤮🤮 `);
  }

  //james

  if (message == '!james') {
    client.say(channel, `@${user.username}, OH JAMES EU QUERO UMA SALADA DE FRUTAS🥗🥵🍋🍍🍌, OLHA🧐 QUE HABILIDADE🏂 OLHA QUE HABILIDADE 🥵⚽ EU QUERO UMA SALADA 🥗 DE FRUTA🍍🍉 JAMES🚶NO CAPRICHO 👌DE 5 🖐️ DE 7🖐️✌️ DE 10🖐️🖐️, ME DA UMA DE 5🖐️, AQUI TÁ NA MÃO ✋🙎🍹TA AQUI ☝️IIIIISSO JAMES 😋 MUITO OBRIGADO 🤝 BRIGADO 😀👍 DEUS ABENÇOE 🙏🤲 ESSE É O JAMES 👉👉😎👈👈 HÃ??? 🧐 DA SALADA DE FRUTAS 🍹😋 O ARTISTA DE CIRCO 🎪 `);
  }

  //Nightbot

  if (message == '!M') {
    client.say(channel, `@${user.username},vai se fuder o night bot já faz isso, pede pra ele`);
    client.say(channel, `!parm`);
  }


  const { MongoClient } = require('mongodb');


  //randomizador de nomes

  if (message.toLowerCase() === '!randomnome') {
    const nomes = ['Nego do Bordel', 'Ryu Indiano', 'Amante da Beiçola', 'Tommy Vercetti das Arabias', 'Fã N°1 do Xamuel', 'Porteiro de wakanda', 'meu indiano favorito', 'bahubali pt.2',
      'emo indiano']; // Insira os nomes que você deseja randomizar
    const randomIndex = Math.floor(Math.random() * nomes.length);
    const randomNome = nomes[randomIndex];
    client.say(channel, `Toddyyz Streamer Streams, ou para os mais intimos ${randomNome}`);
  }

  //randomizador de nomes

  if (message.toLowerCase() === '!randomnevi') {
    const nomes = ['Femboy Lover', 'Amante do Piko', 'Player medio de gacha', ' Pobre de Alphaville', 'sobrinho do carlinhos']; // Insira os nomes que você deseja randomizar
    const randomIndex = Math.floor(Math.random() * nomes.length);
    const randomNome = nomes[randomIndex];
    client.say(channel, `Nevizard, ou para os mais intimos ${randomNome}`);
  }

  //randomizador de nomes

  if (message.toLowerCase() === '!randomnego') {
    const nomes = ['Pantera negra da bahia', ' inspiração pra musica diario de um detendo do racionais', 'Cody Travers da Bahia (sf4)', 'rodo de E-Girl']; // Insira os nomes que você deseja randomizar
    const randomIndex = Math.floor(Math.random() * nomes.length);
    const randomNome = nomes[randomIndex];
    client.say(channel, `Nego Planador, ou para os mais intimos ${randomNome}`);
  }

  //randomizador de nomes

  if (message.toLowerCase() === '!randomelliagah') {
    const nomes = [' Coxa de Aço', ' Rabudão das Arábias', 'Lucinha Egrilo', 'Gasosa do Mk']; // Insira os nomes que você deseja randomizar
    const randomIndex = Math.floor(Math.random() * nomes.length);
    const randomNome = nomes[randomIndex];
    client.say(channel, `Elliagah, ou para os mais intimos ${randomNome}`);
  }

  //cara (cara e coroa)

  if (message.toLowerCase() === '!cara') {
    const chance = 0.5; // Defina a porcentagem desejada aqui (por exemplo, 50%)
    const random = Math.random();

    if (random < chance) {
      // Usuário ganha
      client.say(channel, `Parabéns, @${user.username}! Caiu Cara`);
      client.say(channel, `${user.username} você acertou e caiu 100 pontos do céu 💰`)
      db.get('SELECT * FROM points WHERE username = ?', user.username, (err, row) => {
        if (err) {
          console.error(err.message);
          return;
        }
        const currentPoints = (row ? row.points : 0) + 100;
        if (row) {
          db.run('UPDATE points SET points = ? WHERE username = ?', [currentPoints, user.username], (err) => {
            if (err) {
              console.error(err.message);
            }
          });
        } else {
          db.run('INSERT INTO points (username, points) VALUES (?, ?)', [user.username, 100], (err) => {
            if (err) {
              console.error(err.message);
            }
          });
        }
      });
    } else {
      // Usuário perde
      client.say(channel, `Desculpe, @${user.username}, Caiu Coroa.`);
    }
  }

  //coroa (cara e coroa)

  if (message.toLowerCase() === '!coroa') {
    const chance = 0.5; // Defina a porcentagem desejada aqui (por exemplo, 50%)
    const random = Math.random();

    if (random < chance) {
      // Usuário ganha
      client.say(channel, `Parabéns, @${user.username}! Caiu Coroa`);
      client.say(channel, `${user.username} você acertou e caiu 100 pontos do céu 💰`)
      db.get('SELECT * FROM points WHERE username = ?', user.username, (err, row) => {
        if (err) {
          console.error(err.message);
          return;
        }
        const currentPoints = (row ? row.points : 0) + 100;
        if (row) {
          db.run('UPDATE points SET points = ? WHERE username = ?', [currentPoints, user.username], (err) => {
            if (err) {
              console.error(err.message);
            }
          });
        } else {
          db.run('INSERT INTO points (username, points) VALUES (?, ?)', [user.username, 100], (err) => {
            if (err) {
              console.error(err.message);
            }
          });
        }
      });
    } else {
      // Usuário perde
      client.say(channel, `Desculpe, @${user.username}, Caiu Cara.`);
    }
  }
});


//amor

client.on('message', (channel, tags, message, self) => {
  if (self) return;

  if (message.toLowerCase().startsWith('!amor')) {
    const users = message.toLowerCase().split('!amor ')[1].split(' e ');
    const lovePercentage = Math.floor(Math.random() * 101);
    const response = `A porcentagem de amor entre ${users[0]} e ${users[1]} é de ${lovePercentage}%! ❤️`;

    client.say(channel, response);
  }
});

//pontos

// Cria a tabela se ela não existir
db.serialize(() => {
  db.run('CREATE TABLE if not exists points (username TEXT, points INTEGER)');
});

client.on('message', (channel, tags, message, self) => {
  if (self) return;

  // Verificar se o remetente é moderador ou o streamer
  const isModerator = tags['user-type'] === 'mod';
  const isBroadcaster = channel.slice(1) === tags.username;

  // Comando para adicionar pontos manualmente
  if ((isModerator || isBroadcaster) && message.toLowerCase().startsWith('!addpontos')) {
    const splitMessage = message.split(' ');
    const username = splitMessage[1].toLowerCase(); // Converta para minúsculas para evitar inconsistências
    const amount = parseInt(splitMessage[2]);

    if (!isNaN(amount)) {
      db.get('SELECT * FROM points WHERE username = ?', username, (err, row) => {
        if (err) {
          console.error(err.message);
          return;
        }
        if (row) {
          const currentPoints = row.points + amount;
          db.run('UPDATE points SET points = ? WHERE username = ?', [currentPoints, username], (err) => {
            if (err) {
              console.error(err.message);
            }
          });
        } else {
          db.run('INSERT INTO points (username, points) VALUES (?, ?)', [username, amount], (err) => {
            if (err) {
              console.error(err.message);
            }
          });
        }
        client.say(channel, `@${username} recebeu ${amount} pontos!`);
      });
    }
  }

  if ((isModerator || isBroadcaster) && message.toLowerCase().startsWith('!subpontos')) {
    const splitMessage = message.split(' ');
    const username = splitMessage[1].toLowerCase(); // Converta para minúsculas para evitar inconsistências
    const amount = parseInt(splitMessage[2]);

    if (!isNaN(amount)) {
      db.get('SELECT * FROM points WHERE username = ?', username, (err, row) => {
        if (err) {
          console.error(err.message);
          return;
        }
        if (row) {
          const currentPoints = Math.max(row.points - amount, 0);
          db.run('UPDATE points SET points = ? WHERE username = ?', [currentPoints, username], (err) => {
            if (err) {
              console.error(err.message);
            } else {
              client.say(channel, `@${username} perdeu ${amount} pontos!`);
            }
          });
        } else {
          db.run('INSERT INTO points (username, points) VALUES (?, ?)', [username, 0 - amount], (err) => {
            if (err) {
              console.error(err.message);
            } else {
              client.say(channel, `@${username} perdeu ${amount} pontos!`);
            }
          });
        }
      });
    }
  }

  // Comando para checar pontos
  if (message.toLowerCase() === '!pontos') {
    const username = tags.username.toLowerCase(); // Converta para minúsculas para evitar inconsistências
    db.get('SELECT * FROM points WHERE username = ?', username, (err, row) => {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log('Row:', row);
      const userPoints = row ? row.points : 0;
      console.log(`User Points for ${username}:`, userPoints);
      client.say(channel, `@${username}, você tem ${userPoints} pontos!`);
    });
  }

  //comando para o teste de sorte com copos
  if (message.toLowerCase().startsWith('!sorte')) {
    const username = tags.username.toLowerCase(); // Converta para minúsculas para evitar inconsistências
    const cupOptions = ["copo direito", "copo do meio", "copo esquerdo"];

    // Escolha aleatória de um copo
    const correctCup = cupOptions[Math.floor(Math.random() * cupOptions.length)];

    // Extrai a escolha do usuário da mensagem
    const userChoice = message.toLowerCase().replace('!sorte', '').trim();

    if (cupOptions.includes(userChoice)) {
      if (userChoice === correctCup) {
        db.get('SELECT * FROM points WHERE username = ?', username, (err, row) => {
          if (err) {
            console.error(err.message);
            return;
          }
          const currentPoints = (row ? row.points : 0) + 50;
          if (row) {
            db.run('UPDATE points SET points = ? WHERE username = ?', [currentPoints, username], (err) => {
              if (err) {
                console.error(err.message);
              } else {
                client.say(channel, `@${username}, parabéns! Você acertou e ganhou 50 pontos!`);
              }
            });
          } else {
            db.run('INSERT INTO points (username, points) VALUES (?, ?)', [username, 50], (err) => {
              if (err) {
                console.error(err.message);
              } else {
                client.say(channel, `@${username}, parabéns! Você acertou e ganhou 50 pontos!`);
              }
            });
          }
        });
      } else {
        db.get('SELECT * FROM points WHERE username = ?', username, (err, row) => {
          if (err) {
            console.error(err.message);
            return;
          }
          const currentPoints = Math.max((row ? row.points : 0) - 10, 0);
          if (row) {
            db.run('UPDATE points SET points = ? WHERE username = ?', [currentPoints, username], (err) => {
              if (err) {
                console.error(err.message);
              } else {
                client.say(channel, `@${username}, que pena! Você errou e perdeu 10 pontos.`);
              }
            });
          } else {
            db.run('INSERT INTO points (username, points) VALUES (?, ?)', [username, 0 - 10], (err) => {
              if (err) {
                console.error(err.message);
              } else {
                client.say(channel, `@${username}, que pena! Você errou e perdeu 10 pontos.`);
              }
            });
          }
        });
      }
    } else {
      // Escolha inválida do usuário
      client.say(channel, `@${username}, por favor, escolha entre ${cupOptions.join(', ')}.`);
    }
  }

  // Comando para o cassino
  if (message.toLowerCase().startsWith('!tigrinho')) {
    const username = tags.username;
    const betAmount = parseInt(message.split(' ')[1]);

    db.get('SELECT * FROM points WHERE username = ?', username, (err, row) => {
      if (err) {
        console.error(err.message);
        return;
      }
      if (row) {
        // Usuário já existe na tabela
        const currentPoints = row.points;
        if (betAmount && betAmount <= currentPoints) {
          const randomNumber = Math.floor(Math.random() * 100) + 1; // Gera um número aleatório entre 1 e 100
          if (randomNumber <= 30) {
            // Usuário ganha
            const winnings = betAmount * 2;
            const newPoints = currentPoints + winnings;
            db.run('UPDATE points SET points = ? WHERE username = ?', [newPoints, username], (err) => {
              if (err) {
                console.error(err.message);
              }
            });
            client.say(channel, `@${username} passou a perna e ganhou ${winnings} pontos no tigrinho!`);
          } else {
            // Usuário perde
            const newPoints = currentPoints - betAmount;
            db.run('UPDATE points SET points = ? WHERE username = ?', [newPoints, username], (err) => {
              if (err) {
                console.error(err.message);
              }
            });
            client.say(channel, `@${username} foi roubado pelo tigrinho e perdeu ${betAmount} pontos `);
          }
        } else {
          client.say(channel, `@${username}, você não tem pontos suficientes para apostar essa quantia!`);
        }
      } else {
        // Usuário não existe na tabela, então vamos inserir uma nova entrada para ele
        if (betAmount > 0) {
          client.say(channel, `@${username}, você precisa de pontos para jogar no tigrinho, ou tá achando que a vida é um morango!`);
        }
      }
    });
  }
});

// Fechar a conexão com o banco de dados quando não for mais necessário
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Conexão com o banco de dados fechada.');
    process.exit(0);
  });
});
