-- CreateTable
CREATE TABLE "a_autor" (
    "a_autorId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "a_autorVorname" TEXT NOT NULL,
    "a_autorNachname" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "b_buch" (
    "b_buchId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "b_buchTitel" TEXT NOT NULL,
    "b_buchISBN" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AutorBuecher" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_AutorBuecher_A_fkey" FOREIGN KEY ("A") REFERENCES "a_autor" ("a_autorId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AutorBuecher_B_fkey" FOREIGN KEY ("B") REFERENCES "b_buch" ("b_buchId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "a_autor_a_autorId_key" ON "a_autor"("a_autorId");

-- CreateIndex
CREATE UNIQUE INDEX "b_buch_b_buchId_key" ON "b_buch"("b_buchId");

-- CreateIndex
CREATE UNIQUE INDEX "b_buch_b_buchISBN_key" ON "b_buch"("b_buchISBN");

-- CreateIndex
CREATE UNIQUE INDEX "_AutorBuecher_AB_unique" ON "_AutorBuecher"("A", "B");

-- CreateIndex
CREATE INDEX "_AutorBuecher_B_index" ON "_AutorBuecher"("B");
