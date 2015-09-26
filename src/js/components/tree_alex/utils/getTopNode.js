/**
 * Created by AlexLiu on 2015/9/19.
 */

export default getTopNodes = (arr) => {
    const a = [];

    arr.forEach((item) => {
        const b = a.filter((i) => {
            return item.indexOf(i) === 0;
        });
        if (!b.length) {
            a.push(item);
        }
    });
    return a;
}