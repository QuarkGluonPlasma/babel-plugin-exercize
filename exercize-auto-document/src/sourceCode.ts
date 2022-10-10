
/**
 * say 你好
 * @param name 名字
 */
function sayHi (name: string, age: number, a: boolean):string {
    console.log(`hi, ${name}`);
    return `hi, ${name}`;
}
/**
 * say 你好,没有返回类型
 * @param name 名字
 */
function sayHi2 (name: string, age: number, a: boolean):void {
    console.log(`hi, ${name}`);
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

    /**
     * 方法测试2
     */
     sayHi2 (str:string): string {
        return `hi, I'm ${this.name}. ${str}`;
    }
}
