-- Creamos la tabla principal de motores
CREATE TABLE Motores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    marca TEXT NOT NULL,
    modelo TEXT NOT NULL,
    configuracion TEXT,
    cilindrada_litros REAL,
    potencia_hp INTEGER,
    torque_nm INTEGER,
    aspiracion TEXT -- Turbo o Atmosférico
);

-- Insertamos los datos de tus marcas favoritas
INSERT INTO Motores (marca, modelo, configuracion, cilindrada_litros, potencia_hp, torque_nm, aspiracion)
VALUES 
('Porsche', '911 Carrera', 'Bóxer 6', 3.0, 394, 450, 'Biturbo'),
('Subaru', 'WRX', 'Bóxer 4', 2.4, 271, 350, 'Turbo'),
('Lancia', 'Stratos HF', 'V6 (65°)', 2.4, 190, 226, 'Atmosférico'),
('Saab', '99 Turbo', 'L4 Inclinado', 2.0, 145, 235, 'Turbo');