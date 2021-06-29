/**
 * say 你好
 * @param name 名字
 */
function sayHi (name: string, age: number, a: boolean):string {
    console.log(`hi, ${name}`);
    return `hi, ${name}`;
}

/**
 * 类测试
 */
class Guang {
    name: string; // name 属性
    constructor(name: string) {
        this.name = name;
    }

    /**
     * 方法测试
     */
    sayHi (): string {
        return `hi, I'm ${this.name}`;
    }
}
