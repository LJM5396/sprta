import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
  constructor() {
    this.hp = 100;
    this.minAttack = 5;
  }

  attack() {
    // 플레이어의 공격
    return this.minAttack;
  }

  recovery() {
    this.hp += 50;
  }
}

class Monster {
  constructor(stage) {
    this.hp = 20 * (stage * 0.5);
    this.minAttack = 5 * (stage * 0.5);
  }

  attack() {
    // 몬스터의 공격
    return this.minAttack;
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
      chalk.blueBright(`| Player HP: ${player.hp}, Attack: ${player.minAttack} `) +
      chalk.redBright(`| Monster HP: ${monster.hp}, Attack: ${monster.minAttack} |`),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const printLogs = (logs) => {
  logs.forEach((log) => console.log(log));
};

const battle = async (stage, player, monster) => {
  let logs = [];
  if (stage > 1) {
    logs.push(chalk.greenBright(`체력이 회복되었습니다.`));
  }

  let turn = 1;

  while (player.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    printLogs(logs);

    console.log(chalk.green(`\n1. 공격한다. 2. 도망친다.`));
    const choice = readlineSync.question('당신의 선택은? ');

    // 플레이어의 선택에 따라 다음 행동 처리
    switch (choice) {
      case '1':
        const damage = player.attack();
        monster.hp -= damage;
        logs.push(chalk.green(`[${turn}] 몬스터에게 ${damage}의 피해를 입혔습니다.`));

        if (monster.hp > 0) {
          const monsterDamage = monster.attack();
          player.hp -= monsterDamage;
          logs.push(chalk.red(`[${turn}] 몬스터에게서 ${monsterDamage}의 피해를 입었습니다.`));
        }
        break;
      case '2':
        console.clear();
        displayStatus(stage, player, monster);

        logs.push(chalk.yellow('몬스터에게서 무사히 도망쳤습니다.'));

        printLogs(logs);
        player.recovery();
        return;
      default:
        console.log(chalk.red('올바른 선택을 하세요.'));
        continue;
    }

    if (player.hp <= 0) {
      console.clear();
      displayStatus(stage, player, monster);
      printLogs(logs);

      console.log(chalk.green(`[${turn}] 플레이어가 사망했습니다.`));
      return;
    } else if (monster.hp <= 0) {
      console.clear();
      displayStatus(stage, player, monster);
      printLogs(logs);

      console.log(chalk.green(`[${turn}] 몬스터를 처치했습니다!`));
      player.recovery();
      return;
    }

    turn++;
  }
};

export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(stage);
    await battle(stage, player, monster);

    // 스테이지 클리어 및 게임 종료 조건
    if (player.hp <= 0) {
      console.log(chalk.green(`등반 실패!`));
      break;
    } else if (stage >= 10) {
      console.log(chalk.green(`등반 완료!`));
      break;
    }

    stage++;
    await sleep(3000);
  }
}
