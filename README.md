# Чуть-чуть информации для проверяющих, список багов и как я их ловила:
1.	–
2.	Hermione
3.	Hermione
4.	Jest
5.	Hermione
6.	Hermione
7.	Jest
8.	 Hermione
9.	Hermione
10.	jest
Баги, которые отлавливает Jest удобно проверять, запуская script “test:unit”, при этом меняя номер бага в файле testSetup.js
Чтобы протестировать Hermione, необходимо при первом прогоне сохранить скрины желаемого результата. Запускать используя $env:BUG_ID='6'; npm run start , при этом указывая номер тестируемого бага.
П.С если что пишите мне в тг, @voro_nadya
