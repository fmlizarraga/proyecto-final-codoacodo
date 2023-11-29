import mysql.connector

class Database:
    def __init__(self, host, user, password, database):
        self.conn = mysql.connector.connect(
            host=host,
            user=user,
            password=password
        )
        
        self.cursor = self.conn.cursor()
        
        try:
            self.cursor.execute(f"USE {database}")
            self.create_origins_table()
        except mysql.connector.Error as err:
            if err.errno == mysql.connector.errorcode.ER_BAD_DB_ERROR:
                self.create_database(database)
                self.conn.database = database
            else:
                raise err

    
    def create_database(self, database):
        try:
            self.cursor.execute(f"CREATE DATABASE {database}")
            self.conn.commit()
        except mysql.connector.Error as err:
            self.conn.rollback()
            print(f"Error al crear la base de datos: {err}")
            raise err
    
    def create_origins_table(self):
        # Crea la tabla origins y agrega los países predefinidos
        try:
            self.cursor.execute('''CREATE TABLE IF NOT EXISTS origins (
                id INT PRIMARY KEY,
                country VARCHAR(255) NOT NULL
            )''')
            # Agrega los países predefinidos
            countries = [
                (1, 'Afghanistan'),
                (2, 'Algeria'),
                (3, 'American Samoa'),
                (4, 'Angola'),
                (5, 'Anguilla'),
                (6, 'Argentina'),
                (7, 'Armenia'),
                (8, 'Australia'),
                (9, 'Austria'),
                (10, 'Azerbaijan'),
                (11, 'Bahrain'),
                (12, 'Bangladesh'),
                (13, 'Belarus'),
                (14, 'Bolivia'),
                (15, 'Brazil'),
                (16, 'Brunei'),
                (17, 'Bulgaria'),
                (18, 'Cambodia'),
                (19, 'Cameroon'),
                (20, 'Canada'),
                (21, 'Chad'),
                (22, 'Chile'),
                (23, 'China'),
                (24, 'Colombia'),
                (25, 'Congo, The Democratic Republic of the'),
                (26, 'Czech Republic'),
                (27, 'Dominican Republic'),
                (28, 'Ecuador'),
                (29, 'Egypt'),
                (30, 'Estonia'),
                (31, 'Ethiopia'),
                (32, 'Faroe Islands'),
                (33, 'Finland'),
                (34, 'France'),
                (35, 'French Guiana'),
                (36, 'French Polynesia'),
                (37, 'Gambia'),
                (38, 'Germany'),
                (39, 'Greece'),
                (40, 'Greenland'),
                (41, 'Holy See (Vatican City State)'),
                (42, 'Hong Kong'),
                (43, 'Hungary'),
                (44, 'India'),
                (45, 'Indonesia'),
                (46, 'Iran'),
                (47, 'Iraq'),
                (48, 'Israel'),
                (49, 'Italy'),
                (50, 'Japan'),
                (51, 'Kazakstan'),
                (52, 'Kenya'),
                (53, 'Kuwait'),
                (54, 'Latvia'),
                (55, 'Liechtenstein'),
                (56, 'Lithuania'),
                (57, 'Madagascar'),
                (58, 'Malawi'),
                (59, 'Malaysia'),
                (60, 'Mexico'),
                (61, 'Moldova'),
                (62, 'Morocco'),
                (63, 'Mozambique'),
                (64, 'Myanmar'),
                (65, 'Nauru'),
                (66, 'Nepal'),
                (67, 'Netherlands'),
                (68, 'New Zealand'),
                (69, 'Nigeria'),
                (70, 'North Korea'),
                (71, 'Oman'),
                (72, 'Pakistan'),
                (73, 'Paraguay'),
                (74, 'Peru'),
                (75, 'Philippines'),
                (76, 'Poland'),
                (77, 'Puerto Rico'),
                (78, 'Romania'),
                (79, 'Réunion'),
                (80, 'Russian Federation'),
                (81, 'Saint Vincent and the Grenadines'),
                (82, 'Saudi Arabia'),
                (83, 'Senegal'),
                (84, 'Slovakia'),
                (85, 'South Africa'),
                (86, 'South Korea'),
                (87, 'Spain'),
                (88, 'Sri Lanka'),
                (89, 'Sudan'),
                (90, 'Sweden'),
                (91, 'Switzerland'),
                (92, 'Taiwan'),
                (93, 'Tanzania'),
                (94, 'Thailand'),
                (95, 'Tonga'),
                (96, 'Tunisia'),
                (97, 'Turkey'),
                (98, 'Turkmenistan'),
                (99, 'Tuvalu'),
                (100, 'Ukraine'),
                (101, 'United Arab Emirates'),
                (102, 'United Kingdom'),
                (103, 'United States'),
                (104, 'Venezuela'),
                (105, 'Vietnam'),
                (106, 'Virgin Islands, U.S.'),
                (107, 'Yemen'),
                (108, 'Yugoslavia'),
                (109, 'Zambia')
            ]
            my_id = (1,)
            self.cursor.execute("SELECT * FROM origins WHERE id = %s", my_id)
            check = self.cursor.fetchone()
            if check == None:
                self.cursor.executemany("INSERT INTO origins (id, country) VALUES (%s, %s)", countries)
                self.conn.commit()
        except mysql.connector.Error as err:
            self.conn.rollback()
            print(f"Error al crear la tabla origins: {err}")
            raise err

    def close_connection(self):
        self.cursor.close()
        self.conn.close()