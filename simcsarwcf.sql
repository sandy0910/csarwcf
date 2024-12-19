-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: simcsarwcf
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `airline`
--

DROP TABLE IF EXISTS `airline`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `airline` (
  `airline_id` varchar(100) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `operating_status` int DEFAULT NULL,
  `fleet` int DEFAULT NULL,
  `carbon_rating` int DEFAULT NULL,
  `logo` longblob,
  PRIMARY KEY (`airline_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `airline`
--

LOCK TABLES `airline` WRITE;
/*!40000 ALTER TABLE `airline` DISABLE KEYS */;
INSERT INTO `airline` VALUES ('6E','IndiGo','Gurgaon, India',1,170,5,NULL),('AA','American Airlines','Fort Worth, USA',1,950,3,NULL),('AC','Air Canada','Montreal, Canada',1,400,4,NULL),('AF','Air France','Paris, France',1,210,4,NULL),('AI','Air India','New Delhi, India',1,150,4,NULL),('AZ','Alitalia','Rome, Italy',0,120,2,NULL),('BA','British Airways','London, UK',1,400,5,NULL),('BR','EVA Air','Taipei, Taiwan',1,90,4,NULL),('CA','Air China','Beijing, China',1,400,3,NULL),('CX','Cathay Pacific','Hong Kong, China',1,150,5,NULL),('DL','Delta Airlines','Atlanta, USA',1,800,4,NULL),('EK','Emirates','Dubai, UAE',1,250,4,NULL),('ET','Ethiopian Airlines','Addis Ababa, Ethiopia',1,100,3,NULL),('EY','Etihad Airways','Abu Dhabi, UAE',1,120,4,NULL),('FJ','Fiji Airways','Nadi, Fiji',1,30,3,NULL),('G8','GoAir','Mumbai, India',1,60,4,NULL),('IB','Iberia','Madrid, Spain',1,130,4,NULL),('JL','Japan Airlines','Tokyo, Japan',1,180,5,NULL),('KLM','KLM Royal Dutch Airlines','Amsterdam, Netherlands',1,170,4,NULL),('LH','Lufthansa','Cologne, Germany',1,500,5,NULL),('LY','El Al','Tel Aviv, Israel',1,45,3,NULL),('MH','Malaysia Airlines','Kuala Lumpur, Malaysia',1,80,3,NULL),('NZ','Air New Zealand','Auckland, New Zealand',1,100,4,NULL),('QF','Qantas','Sydney, Australia',1,130,4,NULL),('QR','Qatar Airways','Doha, Qatar',1,220,5,NULL),('SA','South African Airways','Johannesburg, South Africa',1,60,3,NULL),('SG','SpiceJet','Gurgaon, India',1,80,3,NULL),('SQ','Singapore Airlines','Singapore',1,200,5,NULL),('SU','Aeroflot','Moscow, Russia',1,250,4,NULL),('TK','Turkish Airlines','Istanbul, Turkey',1,350,4,NULL),('UA','United Airlines','Chicago, USA',1,750,3,NULL),('UK','Vistara','New Delhi, India',1,40,4,NULL);
/*!40000 ALTER TABLE `airline` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `airport`
--

DROP TABLE IF EXISTS `airport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `airport` (
  `airport_id` varchar(100) NOT NULL,
  `airport_name` varchar(200) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `geolocation` point DEFAULT NULL,
  PRIMARY KEY (`airport_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `airport`
--

LOCK TABLES `airport` WRITE;
/*!40000 ALTER TABLE `airport` DISABLE KEYS */;
INSERT INTO `airport` VALUES ('AMD','Sardar Vallabhbhai Patel International Airport','Ahmedabad','India',_binary '\0\0\0\0\0\0\0jºtì(R@2\ÊÆ%\‰7@'),('AMS','Amsterdam Airport Schiphol','Amsterdam','Netherlands',_binary '\0\0\0\0\0\0\0\ﬂOçón@\÷\≈m4Ä\'J@'),('ARN','Stockholm Arlanda Airport','Stockholm','Sweden',_binary '\0\0\0\0\0\0\0≤ù\Ôß\∆\Î1@ñ!éuq\”M@'),('ATH','Athens International Airport','Athens','Greece',_binary '\0\0\0\0\0\0\0lxz•,Û7@Zd;\ﬂ˜B@'),('ATL','Hartsfield-Jackson Atlanta International Airport','Atlanta','United States',_binary '\0\0\0\0\0\0\0V}Æ∂bU¿F%u\“@@'),('ATQ','Sri Guru Ram Dass Jee International Airport','Amritsar','India',_binary '\0\0\0\0\0\0\0åJ\Í¥R@ˆó›ìáÖ?@'),('AUH','Abu Dhabi International Airport','Abu Dhabi','UAE',_binary '\0\0\0\0\0\0\0z6´>WSK@∞\Áå(m8@'),('BCN','Barcelona-El Prat Airport','Barcelona','Spain',_binary '\0\0\0\0\0\0\0T„•õƒ†\0@\Áå(\Ì\r¶D@'),('BKK','Suvarnabhumi Airport','Bangkok','Thailand',_binary '\0\0\0\0\0\0\0+á\Ÿ\Œ/Y@∑\—\0\ﬁb+@'),('BLR','Kempegowda International Airport','Bangalore','India',_binary '\0\0\0\0\0\0\0ß\∆K7mS@°¯1\ÊÆe*@'),('BOM','Chhatrapati Shivaji Maharaj International Airport','Mumbai','India',_binary '\0\0\0\0\0\0\0¿\Ïû<,8R@˙~jºt3@'),('BRU','Brussels Airport','Brussels','Belgium',_binary '\0\0\0\0\0\0\0ˇ!˝ˆu\‡@ñ!éuqsI@'),('BUD','Budapest Ferenc Liszt International Airport','Budapest','Hungary',_binary '\0\0\0\0\0\0\0P¸s\◊B3@µ¶y∑G@'),('CAI','Cairo International Airport','Cairo','Egypt',_binary '\0\0\0\0\0\0\0ÚA\œf\’g?@\Âa°\÷4>@'),('CAN','Guangzhou Baiyun International Airport','Guangzhou','China',_binary '\0\0\0\0\0\0\0¨Zd;S\\@\‹h\0oÅd7@'),('CCU','Netaji Subhas Chandra Bose International Airport','Kolkata','India',_binary '\0\0\0\0\0\0\0™`TR\'V@ÜZ”º\„§6@'),('CDG','Charles de Gaulle Airport','Paris','France',_binary '\0\0\0\0\0\0\0ffffff@∑b\Ÿ=ÅH@'),('CJB','Coimbatore International Airport','Coimbatore','India',_binary '\0\0\0\0\0\0\0–≥YıπBS@\'¬ÜßW\n&@'),('CLT','Charlotte Douglas International Airport','Charlotte','United States',_binary '\0\0\0\0\0\0\0\„6\Z¿[<T¿¨ZdõA@'),('COK','Cochin International Airport','Kochi','India',_binary '\0\0\0\0\0\0\0\Ô\…\√B≠S@í\\˛C˙M$@'),('CPH','Copenhagen Airport','Copenhagen','Denmark',_binary '\0\0\0\0\0\0\0ìVM)@\…væü\Z\œK@'),('CPT','Cape Town International Airport','Cape Town','South Africa',_binary '\0\0\0\0\0\0\0F%uö2@§p=\n\◊˚@¿'),('DAR','Julius Nyerere International Airport','Dar es Salaam','Tanzania',_binary '\0\0\0\0\0\0\0<N—ë\\ñC@Zıπ⁄ä}¿'),('DEL','Indira Gandhi International Airport','New Delhi','India',_binary '\0\0\0\0\0\0\0L7âA`MS@∞\Áå(ù<@'),('DEN','Denver International Airport','Denver','USA',_binary '\0\0\0\0\0\0\0,‘ö\Ê+Z¿Ñ\rOØî\ÌC@'),('DFW','Dallas/Fort Worth International Airport','Dallas/Fort Worth','USA',_binary '\0\0\0\0\0\0\0ë~˚:pBX¿lxz•,s@@'),('DIB','Dibrugarh Airport','Dibrugarh','India',_binary '\0\0\0\0\0\0\0\—\"\€˘~íW@™Ò\“Mbp;@'),('DME','Domodedovo International Airport','Moscow','Russia',_binary '\0\0\0\0\0\0\0≤.n£ÙB@±ø\Ïû<¥K@'),('DOH','Hamad International Airport','Doha','Qatar',_binary '\0\0\0\0\0\0\0vq\r\‡\ÕI@m\Á˚©ÒB9@'),('DUB','Dublin Airport','Dublin','Ireland',_binary '\0\0\0\0\0\0\0ß\ËH.ˇ¿Ö\ÎQ∏∂J@'),('DXB','Dubai International Airport','Dubai','United Arab Emirates',_binary '\0\0\0\0\0\0\0\ T¡®§ÆK@\‚X∑\—@9@'),('EWR','Newark Liberty International Airport','New York','United States',_binary '\0\0\0\0\0\0\0∫I+ãR¿\«K7âAXD@'),('FCO','Leonardo da Vinci‚ÄìFiumicino Airport','Rome','Italy',_binary '\0\0\0\0\0\0\0\0\0\0\0\0Ä(@ë~˚:p\ÊD@'),('FRA','Frankfurt Airport','Frankfurt','Germany',_binary '\0\0\0\0\0\0\0˘1\ÊÆ%$!@[B>\Ë\ŸI@'),('GAY','Gaya Airport','Gaya','India',_binary '\0\0\0\0\0\0\0ıπ⁄ä˝=U@µ¶y\«\…8@'),('GIG','Rio de Janeiro-Gale√£o International Airport','Rio de Janeiro','Brazil',_binary '\0\0\0\0\0\0\0ß\ËH.üE¿;MÑ\r\œ6¿'),('GOI','Goa International Airport','Dabolim','India',_binary '\0\0\0\0\0\0\0∞\Áå(uR@˜u\‡ú\≈.@'),('GRU','S√£o Paulo-Guarulhos International Airport','S√£o Paulo','Brazil',_binary '\0\0\0\0\0\0\0[B>\Ë\Ÿ<G¿vOjm7¿'),('GVA','Geneva Airport','Geneva','Switzerland',_binary '\0\0\0\0\0\0\0z•,Ck@ÿÅsFîG@'),('HEL','Helsinki-Vantaa Airport','Helsinki','Finland',_binary '\0\0\0\0\0\0\0ÿÅsFîˆ8@F%uö(N@'),('HKG','Hong Kong International Airport','Hong Kong','Hong Kong',_binary '\0\0\0\0\0\0\0%ÅïC{\\@\…\Â?§\ﬂN6@'),('HND','Haneda Airport','Tokyo','Japan',_binary '\0\0\0\0\0\0\0w-!Ùxa@6<ΩR\∆A@'),('HYD','Rajiv Gandhi International Airport','Hyderabad','India',_binary '\0\0\0\0\0\0\0shë\Ì|õS@\Í46<1@'),('ICN','Incheon International Airport','Seoul','South Korea',_binary '\0\0\0\0\0\0\0F∂Û˝‘ú_@y\È&1ºB@'),('IDR','Devi Ahilya Bai Holkar Airport','Indore','India',_binary '\0\0\0\0\0\0\0W[±ø\Ï˙R@\Í46º6@'),('IST','Istanbul Airport','Istanbul','Turkey',_binary '\0\0\0\0\0\0\0oÅ≈è\—<@öôôôô°D@'),('IXA','Agartala Airport','Agartala','India',_binary '\0\0\0\0\0\0\0û^)\À\◊V@\’\Áj+ˆ\◊7@'),('IXB','Bagdogra Airport','Bagdogra','India',_binary '\0\0\0\0\0\0\0l	˘†gV@´>W[±Ø:@'),('IXC','Chandigarh International Airport','Chandigarh','India',_binary '\0\0\0\0\0\0\0òLåJ2S@\›$Åïì>@'),('IXD','Bamrauli Airport','Prayagraj','India',_binary '\0\0\0\0\0\0\0†\Z/\›$vT@˚\À\Ó\…\√r9@'),('IXM','Madurai Airport','Madurai','India',_binary '\0\0\0\0\0\0\0ÙlV}ÆÜS@ioÖ\…\‘#@'),('IXR','Birsa Munda Airport','Ranchi','India',_binary '\0\0\0\0\0\0\0RIùÄ&VU@Æ\ÿ_vO^7@'),('IXZ','Vizag Airport','Visakhapatnam','India',_binary '\0\0\0\0\0\0\0ıπ⁄ä˝\ÕT@ò›ìáÖ∫1@'),('JAI','Jaipur International Airport','Jaipur','India',_binary '\0\0\0\0\0\0\0k+ˆó\›ÛR@\ﬁqäé\‰\“:@'),('JFK','John F. Kennedy International Airport','New York','United States',_binary '\0\0\0\0\0\0\0KYÜ8\÷qR¿`vORD@'),('JNB','O.R. Tambo International Airport','Johannesburg','South Africa',_binary '\0\0\0\0\0\0\0]m\≈˛≤;<@2U0*©#:¿'),('KGL','Kigali International Airport','Kigali','Rwanda',_binary '\0\0\0\0\0\0\0\…væü\Z>@L¶\nF%uˇø'),('KHI','Jinnah International Airport','Karachi','Pakistan',_binary '\0\0\0\0\0\0\05\Ô8EG\ P@6<ΩR\Ê8@'),('KLH','Chhatrapati Shahu Maharaj Airport','Kolhapur','India',_binary '\0\0\0\0\0\0\0\ﬁqäé\‰éR@ß\ËH.ˇ±0@'),('KUL','Kuala Lumpur International Airport','Kuala Lumpur','Malaysia',_binary '\0\0\0\0\0\0\0ØîeàcmY@I.ˇ!˝ˆ@'),('LAX','Los Angeles International Airport','Los Angeles','United States',_binary '\0\0\0\0\0\0\0uöö]¿õUü´≠¯@@'),('LCY','London City Airport','London','United Kingdom',_binary '\0\0\0\0\0\0\0≤ù\Ôß\∆KßøbX9¥¿I@'),('LGW','London Gatwick Airport','London','UK',_binary '\0\0\0\0\0\0\0\Î\‚6\Z¿[»ø\–D\ÿÙíI@'),('LHR','Heathrow Airport','London','United Kingdom',_binary '\0\0\0\0\0\0\0¡®§N@›ø\\è\¬ı(ºI@'),('LIN','Linate Airport','Milan','Italy',_binary '\0\0\0\0\0\0\0vOjç\"@\”MbXπF@'),('LIS','Lisbon Airport','Lisbon','Portugal',_binary '\0\0\0\0\0\0\0˜u\‡úE\"¿HP¸cC@'),('MAA','Chennai International Airport','Chennai','India',_binary '\0\0\0\0\0\0\0+á\Ÿ\nT@]˛C˙\Ì+*@'),('MAD','Adolfo Su√°rez Madrid‚ÄìBarajas Airport','Madrid','Spain',_binary '\0\0\0\0\0\0\0Tt$óˇê¿Å≈è1?D@'),('MCT','Muscat International Airport','Muscat','Oman',_binary '\0\0\0\0\0\0\0ïeàc]$M@ú¢#π¸ó7@'),('MEL','Melbourne Airport','Melbourne','Australia',_binary '\0\0\0\0\0\0\0\Â\–\"\€˘\Zb@\ 2ƒ±.\÷B¿'),('MEX','Mexico City International Airport','Mexico City','Mexico',_binary '\0\0\0\0\0\0\0+á\≈X¿´>W[±o3@'),('MIA','Miami International Airport','Miami','USA',_binary '\0\0\0\0\0\0\0™`TR\'T¿≥\Ísµ\À9@'),('MXP','Milan Malpensa Airport','Milan','Italy',_binary '\0\0\0\0\0\0\0çónÉ@!@ˇ≤{Ú∞\–F@'),('NBO','Jomo Kenyatta International Airport','Nairobi','Kenya',_binary '\0\0\0\0\0\0\0Ö\ÎQ∏vB@f/\€Nıø'),('NRT','Narita International Airport','Tokyo','Japan',_binary '\0\0\0\0\0\0\0jMÛéSåa@^∫I\„A@'),('ORD','O\'Hare International Airport','Chicago','United States',_binary '\0\0\0\0\0\0\0ã˝e˜\‰˘U¿±\·Èï≤¸D@'),('ORY','Orly Airport','Paris','France',_binary '\0\0\0\0\0\0\0åJ\Í4@>\ËŸ¨˙\\H@'),('OSL','Oslo Gardermoen Airport','Oslo','Norway',_binary '\0\0\0\0\0\0\0àÙ\€◊Å3&@T„•õ\ƒN@'),('PAT','Jay Prakash Narayan International Airport','Patna','India',_binary '\0\0\0\0\0\0\0ú¢#π¸KU@d]\‹Fò9@'),('PEK','Beijing Capital International Airport','Beijing','China',_binary '\0\0\0\0\0\0\0vOj%]@n4Ä∑@\nD@'),('PHL','Philadelphia International Airport','Philadelphia','United States',_binary '\0\0\0\0\0\0\0ñ!éuq\œR¿Ú∞Pkö\ÔC@'),('PNQ','Pune International Airport','Pune','India',_binary '\0\0\0\0\0\0\0ÅïCãl{R@§p=\n◊ì2@'),('RPR','Raipur Airport','Raipur','India',_binary '\0\0\0\0\0\0\0¨ZdoT@K\»=õ%5@'),('SAW','Sabiha G√∂k√ßen International Airport','Istanbul','Turkey',_binary '\0\0\0\0\0\0\0W\Ï/ª\'O=@~åπk	qD@'),('SEA','Seattle-Tacoma International Airport','Seattle','United States',_binary '\0\0\0\0\0\0\0O@a√ì^¿6<ΩRñπG@'),('SFO','San Francisco International Airport','San Francisco','United States',_binary '\0\0\0\0\0\0\0P¸s◊ö^¿ùÄ&¬Ü\œB@'),('SGN','Tan Son Nhat International Airport','Ho Chi Minh City','Vietnam',_binary '\0\0\0\0\0\0\0°¯1ÊÆ©Z@⁄¨˙\\m•%@'),('SIN','Singapore Changi Airport','Singapore','Singapore',_binary '\0\0\0\0\0\0\0V-≤ùˇY@1ô*ï\‘ı?'),('SVO','Sheremetyevo International Airport','Moscow','Russia',_binary '\0\0\0\0\0\0\0˜u\‡úµB@\Õ;N—ë¸K@'),('SYD','Sydney Kingsford Smith Airport','Sydney','Australia',_binary '\0\0\0\0\0\0\0=õUü´\Âb@U¡®§N¯@¿'),('TIR','Tirupati Airport','Tirupati','India',_binary '\0\0\0\0\0\0\0ònÉ¿\ÊS@6<ΩRñA+@'),('TLV','Ben Gurion Airport','Tel Aviv','Israel',_binary '\0\0\0\0\0\0\0®W\ 2\ƒqA@bX9¥\0@@'),('TRV','Thiruvananthapuram International Airport','Thiruvananthapuram','India',_binary '\0\0\0\0\0\0\0P¸s\◊:S@è\¬ı(\\\Ô @'),('TRZ','Trichy International Airport','Tiruchirappalli','India',_binary '\0\0\0\0\0\0\0x$(~¨S@\÷V\Ï/ªá%@'),('UJP','Pantnagar Airport','Pantnagar','India',_binary '\0\0\0\0\0\0\0í\\˛C˙\›S@˘†g≥\Í=@'),('VGA','Vijayawada Airport','Vijayawada','India',_binary '\0\0\0\0\0\0\0%uö3T@⁄¨˙\\mÖ0@'),('VIE','Vienna International Airport','Vienna','Austria',_binary '\0\0\0\0\0\0\0/\›$ë0@<ΩRñ!H@'),('WAW','Warsaw Chopin Airport','Warsaw','Poland',_binary '\0\0\0\0\0\0\0C\Î\‚6˙4@>yX®5J@'),('YVR','Vancouver International Airport','Vancouver','Canada',_binary '\0\0\0\0\0\0\0\÷V\Ï/ª\À^¿HP¸òH@'),('YYZ','Toronto Pearson International Airport','Toronto','Canada',_binary '\0\0\0\0\0\0\0ú¢#π¸\ÁS¿\Ê?§ﬂæ\÷E@'),('ZRH','Zurich Airport','Zurich','Switzerland',_binary '\0\0\0\0\0\0\0öwú¢#!@¡9#J{ªG@');
/*!40000 ALTER TABLE `airport` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cabinclass`
--

DROP TABLE IF EXISTS `cabinclass`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cabinclass` (
  `cc_id` int NOT NULL AUTO_INCREMENT,
  `class_id` int DEFAULT NULL,
  `flight_id` varchar(100) DEFAULT NULL,
  `capacity` int DEFAULT NULL,
  `price_per_seat` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`cc_id`)
) ENGINE=InnoDB AUTO_INCREMENT=352 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cabinclass`
--

LOCK TABLES `cabinclass` WRITE;
/*!40000 ALTER TABLE `cabinclass` DISABLE KEYS */;
INSERT INTO `cabinclass` VALUES (1,1,'FL001',120,10000.00),(2,3,'FL001',30,25000.00),(3,4,'FL001',10,50000.00),(4,1,'FL002',150,12000.00),(5,2,'FL002',40,30000.00),(6,3,'FL002',20,60000.00),(7,1,'FL003',130,11000.00),(8,3,'FL003',50,26000.00),(9,4,'FL003',20,58000.00),(10,1,'FL004',100,13000.00),(11,2,'FL004',30,28000.00),(12,5,'FL004',20,67000.00),(13,1,'FL005',180,11500.00),(14,3,'FL005',20,30000.00),(15,5,'FL005',10,65000.00),(16,1,'FL006',150,12500.00),(17,3,'FL006',30,31000.00),(18,4,'FL006',15,70000.00),(19,1,'FL007',90,11500.00),(20,2,'FL007',40,27500.00),(21,4,'FL007',20,60000.00),(22,6,'FL007',5,120000.00),(23,1,'FL008',160,12000.00),(24,2,'FL008',30,27000.00),(25,3,'FL008',20,59000.00),(26,1,'FL009',180,14000.00),(27,3,'FL009',30,50000.00),(28,5,'FL009',20,70000.00),(29,1,'FL010',150,13500.00),(30,2,'FL010',50,27000.00),(31,4,'FL010',30,68000.00),(32,1,'FL011',200,15000.00),(33,3,'FL011',30,49000.00),(34,4,'FL011',10,85000.00),(35,1,'FL012',220,13000.00),(36,2,'FL012',50,30000.00),(37,5,'FL012',10,78000.00),(38,1,'FL013',160,14500.00),(39,3,'FL013',30,53000.00),(40,4,'FL013',20,85000.00),(41,1,'FL014',150,14000.00),(42,2,'FL014',40,29000.00),(43,5,'FL014',10,76000.00),(44,1,'FL015',200,15500.00),(45,3,'FL015',40,32000.00),(46,6,'FL015',10,90000.00),(47,1,'FL016',170,13000.00),(48,2,'FL016',50,35000.00),(49,4,'FL016',20,67000.00),(50,1,'FL017',210,18000.00),(51,3,'FL017',30,47000.00),(52,5,'FL017',20,88000.00),(53,1,'FL018',200,14500.00),(54,2,'FL018',60,31000.00),(55,4,'FL018',10,76000.00),(56,1,'FL019',160,16000.00),(57,3,'FL019',40,50000.00),(58,5,'FL019',10,81000.00),(59,1,'FL020',150,13000.00),(60,2,'FL020',60,31000.00),(61,3,'FL020',20,59000.00),(62,6,'FL020',5,100000.00),(63,1,'FL021',130,11500.00),(64,2,'FL021',40,28000.00),(65,5,'FL021',20,75000.00),(66,1,'FL022',190,15000.00),(67,2,'FL022',50,32000.00),(68,4,'FL022',10,72000.00),(69,1,'FL023',170,16000.00),(70,3,'FL023',50,49000.00),(71,5,'FL023',10,80000.00),(72,1,'FL024',150,14500.00),(73,2,'FL024',40,29000.00),(74,4,'FL024',20,69000.00),(75,1,'FL025',200,15500.00),(76,3,'FL025',30,33000.00),(77,6,'FL025',15,92000.00),(78,1,'FL026',180,12500.00),(79,2,'FL026',40,28000.00),(80,4,'FL026',20,62000.00),(81,1,'FL027',160,13500.00),(82,3,'FL027',50,36000.00),(83,5,'FL027',10,70000.00),(84,1,'FL028',200,14500.00),(85,2,'FL028',60,31000.00),(86,4,'FL028',20,67000.00),(87,1,'FL029',160,15500.00),(88,3,'FL029',40,52000.00),(89,5,'FL029',10,78000.00),(90,1,'FL030',190,14000.00),(91,2,'FL030',50,31000.00),(92,4,'FL030',20,75000.00),(93,1,'FL031',220,13000.00),(94,2,'FL031',40,29000.00),(95,5,'FL031',20,77000.00),(96,1,'FL032',170,15000.00),(97,3,'FL032',50,33000.00),(98,4,'FL032',20,85000.00),(99,1,'FL033',150,16000.00),(100,2,'FL033',40,31000.00),(101,5,'FL033',10,83000.00),(102,1,'FL034',200,14000.00),(103,2,'FL034',50,32000.00),(104,6,'FL034',10,95000.00),(105,1,'FL035',190,15000.00),(106,3,'FL035',30,52000.00),(107,5,'FL035',20,72000.00),(108,1,'FL036',160,13500.00),(109,2,'FL036',50,32000.00),(110,4,'FL036',10,65000.00),(111,1,'FL037',150,14500.00),(112,2,'FL037',60,30000.00),(113,4,'FL037',20,78000.00),(114,1,'FL038',140,15000.00),(115,3,'FL038',40,52000.00),(116,6,'FL038',10,99000.00),(117,1,'FL039',170,14000.00),(118,2,'FL039',60,30000.00),(119,4,'FL039',20,81000.00),(120,1,'FL040',180,13000.00),(121,3,'FL040',40,50000.00),(122,5,'FL040',10,77000.00),(123,1,'FL041',130,11000.00),(124,2,'FL041',40,29000.00),(125,5,'FL041',10,69000.00),(126,1,'FL042',200,15000.00),(127,3,'FL042',30,49000.00),(128,4,'FL042',20,80000.00),(129,1,'FL043',180,14000.00),(130,2,'FL043',50,31000.00),(131,5,'FL043',10,72000.00),(132,1,'FL044',170,13500.00),(133,3,'FL044',40,50000.00),(134,4,'FL044',10,70000.00),(135,1,'FL045',160,14500.00),(136,2,'FL045',40,29000.00),(137,5,'FL045',20,75000.00),(138,1,'FL046',190,15500.00),(139,3,'FL046',30,32000.00),(140,6,'FL046',10,88000.00),(141,1,'FL047',150,14000.00),(142,2,'FL047',40,30000.00),(143,4,'FL047',15,74000.00),(144,1,'FL048',180,13000.00),(145,3,'FL048',40,53000.00),(146,5,'FL048',10,81000.00),(147,1,'FL049',160,15000.00),(148,2,'FL049',50,32000.00),(149,4,'FL049',20,78000.00),(150,1,'FL050',200,15500.00),(151,3,'FL050',40,50000.00),(152,6,'FL050',10,90000.00),(153,1,'FL051',30,10000.00),(154,5,'FL051',22,92000.00),(155,2,'FL051',180,58000.00),(156,3,'FL051',40,35000.00),(157,1,'FL052',50,26000.00),(158,2,'FL052',80,46000.00),(159,3,'FL052',30,67000.00),(160,4,'FL052',10,86000.00),(161,5,'FL052',5,72000.00),(162,1,'FL053',60,15000.00),(163,2,'FL053',70,54000.00),(164,3,'FL053',20,68000.00),(165,4,'FL053',15,77000.00),(166,5,'FL053',8,88000.00),(167,1,'FL054',65,30000.00),(168,2,'FL054',90,75000.00),(169,3,'FL054',25,51000.00),(170,4,'FL054',12,82000.00),(171,5,'FL054',7,90000.00),(172,1,'FL055',45,25000.00),(173,2,'FL055',85,70000.00),(174,3,'FL055',35,53000.00),(175,4,'FL055',10,88000.00),(176,5,'FL055',6,90000.00),(177,1,'FL056',55,32000.00),(178,2,'FL056',78,50000.00),(179,3,'FL056',28,66000.00),(180,4,'FL056',14,86000.00),(181,5,'FL056',5,77000.00),(182,1,'FL057',50,28000.00),(183,2,'FL057',82,67000.00),(184,3,'FL057',25,59000.00),(185,4,'FL057',11,75000.00),(186,5,'FL057',4,81000.00),(187,1,'FL058',68,42000.00),(188,2,'FL058',75,68000.00),(189,3,'FL058',22,59000.00),(190,4,'FL058',10,83000.00),(191,5,'FL058',6,62000.00),(192,1,'FL059',70,40000.00),(193,2,'FL059',80,74000.00),(194,3,'FL059',26,57000.00),(195,4,'FL059',12,66000.00),(196,5,'FL059',5,81000.00),(197,1,'FL060',45,15000.00),(198,2,'FL060',90,67000.00),(199,3,'FL060',20,72000.00),(200,4,'FL060',14,80000.00),(201,5,'FL060',3,69000.00),(202,1,'FL061',40,13500.00),(203,2,'FL061',85,53000.00),(204,3,'FL061',18,60000.00),(205,4,'FL061',13,76000.00),(206,5,'FL061',7,68000.00),(207,1,'FL062',52,19000.00),(208,2,'FL062',78,54000.00),(209,3,'FL062',30,61000.00),(210,4,'FL062',15,72000.00),(211,5,'FL062',6,68000.00),(212,1,'FL063',63,25000.00),(213,2,'FL063',73,55000.00),(214,3,'FL063',25,65000.00),(215,4,'FL063',12,86000.00),(216,5,'FL063',8,72000.00),(217,1,'FL064',55,29000.00),(218,2,'FL064',65,45000.00),(219,3,'FL064',30,63000.00),(220,4,'FL064',14,75000.00),(221,5,'FL064',9,86000.00),(222,1,'FL065',45,32000.00),(223,2,'FL065',85,52000.00),(224,3,'FL065',22,70000.00),(225,4,'FL065',10,81000.00),(226,5,'FL065',5,78000.00),(227,1,'FL066',55,32000.00),(228,2,'FL066',78,46000.00),(229,3,'FL066',25,54000.00),(230,4,'FL066',12,69000.00),(231,5,'FL066',4,67000.00),(232,1,'FL067',50,15000.00),(233,2,'FL067',70,50000.00),(234,3,'FL067',30,63000.00),(235,4,'FL067',15,65000.00),(236,5,'FL067',6,73000.00),(237,1,'FL068',60,22000.00),(238,2,'FL068',75,53000.00),(239,3,'FL068',20,61000.00),(240,4,'FL068',13,69000.00),(241,5,'FL068',8,80000.00),(242,1,'FL069',68,40000.00),(243,2,'FL069',85,74000.00),(244,3,'FL069',22,53000.00),(245,4,'FL069',10,60000.00),(246,5,'FL069',4,82000.00),(247,1,'FL070',72,46000.00),(248,2,'FL070',80,70000.00),(249,3,'FL070',25,63000.00),(250,4,'FL070',12,72000.00),(251,5,'FL070',5,77000.00),(252,1,'FL071',50,25000.00),(253,2,'FL071',78,65000.00),(254,3,'FL071',35,59000.00),(255,4,'FL071',15,77000.00),(256,5,'FL071',3,72000.00),(257,1,'FL072',60,32000.00),(258,2,'FL072',70,50000.00),(259,3,'FL072',30,63000.00),(260,4,'FL072',12,82000.00),(261,1,'FL073',65,33000.00),(262,3,'FL073',28,59000.00),(263,4,'FL073',10,70000.00),(264,1,'FL074',70,35000.00),(265,2,'FL074',75,68000.00),(266,3,'FL074',25,74000.00),(267,4,'FL074',14,82000.00),(268,2,'FL075',80,53000.00),(269,3,'FL075',30,59000.00),(270,4,'FL075',12,74000.00),(271,5,'FL075',4,88000.00),(272,4,'FL076',13,64000.00),(273,5,'FL076',6,82000.00),(274,1,'FL077',72,33000.00),(275,2,'FL077',80,74000.00),(276,3,'FL077',22,61000.00),(277,4,'FL077',14,83000.00),(278,5,'FL077',4,70000.00),(279,2,'FL078',80,65000.00),(280,3,'FL078',15,75000.00),(281,4,'FL078',11,67000.00),(282,1,'FL079',55,22000.00),(283,3,'FL079',35,54000.00),(284,4,'FL079',8,70000.00),(285,2,'FL080',78,50000.00),(286,3,'FL080',20,58000.00),(287,4,'FL080',12,67000.00),(288,1,'FL081',72,48000.00),(289,3,'FL081',25,59000.00),(290,5,'FL081',6,70000.00),(291,2,'FL082',82,55000.00),(292,3,'FL082',20,62000.00),(293,4,'FL082',5,72000.00),(294,5,'FL082',3,77000.00),(295,1,'FL083',68,10000.00),(296,2,'FL083',78,30000.00),(297,5,'FL083',5,90000.00),(298,1,'FL084',70,12000.00),(299,2,'FL084',75,31000.00),(300,3,'FL084',30,50000.00),(301,4,'FL084',14,80000.00),(302,5,'FL084',6,90000.00),(303,1,'FL085',65,15000.00),(304,2,'FL085',80,32000.00),(305,3,'FL085',22,49000.00),(306,4,'FL085',13,75000.00),(307,5,'FL085',5,90000.00),(308,1,'FL086',60,10000.00),(309,2,'FL086',75,30000.00),(310,3,'FL086',28,46000.00),(311,4,'FL086',14,80000.00),(312,5,'FL086',5,90000.00),(313,1,'FL087',70,13000.00),(314,2,'FL087',80,32000.00),(315,5,'FL087',7,90000.00),(316,1,'FL088',60,12000.00),(317,2,'FL088',70,29000.00),(318,3,'FL088',30,49000.00),(319,4,'FL088',13,70000.00),(320,1,'FL089',75,12000.00),(321,2,'FL089',85,31000.00),(322,3,'FL089',22,50000.00),(323,4,'FL089',14,75000.00),(324,5,'FL089',5,90000.00),(325,1,'FL090',60,11000.00),(326,2,'FL090',80,28000.00),(327,3,'FL090',30,50000.00),(328,5,'FL090',6,90000.00),(329,1,'FL091',65,10000.00),(330,2,'FL091',75,29000.00),(331,3,'FL091',25,47000.00),(332,4,'FL091',11,80000.00),(333,5,'FL091',6,90000.00),(334,1,'FL092',70,12000.00),(335,2,'FL092',80,31000.00),(336,3,'FL092',28,49000.00),(337,4,'FL092',13,75000.00),(338,1,'FL093',60,10000.00),(339,2,'FL093',75,29000.00),(340,3,'FL093',30,50000.00),(341,4,'FL093',12,75000.00),(342,5,'FL093',7,90000.00),(343,1,'FL094',65,15000.00),(344,2,'FL094',80,32000.00),(345,4,'FL094',13,75000.00),(346,5,'FL094',6,90000.00),(347,1,'FL095',70,13000.00),(348,2,'FL095',80,32000.00),(349,3,'FL095',30,50000.00),(350,4,'FL095',14,75000.00),(351,5,'FL095',6,90000.00);
/*!40000 ALTER TABLE `cabinclass` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emissions`
--

DROP TABLE IF EXISTS `emissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emissions` (
  `flight_schedule_id` int NOT NULL,
  `passengers_travelled` int DEFAULT NULL,
  `passengers_weight` float DEFAULT NULL,
  `baggage_weight` float DEFAULT NULL,
  `act_emission` float DEFAULT NULL,
  `estimated_emission` float DEFAULT NULL,
  PRIMARY KEY (`flight_schedule_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emissions`
--

LOCK TABLES `emissions` WRITE;
/*!40000 ALTER TABLE `emissions` DISABLE KEYS */;
INSERT INTO `emissions` VALUES (1,39,3220,2612,3900.56,4153.61),(2,22,1448,1884,2524.34,2539.12),(3,72,5121,4917,8740.89,9407.86),(4,94,8206,7646,8092.1,7462.75),(5,166,12409,9245,11549.7,11575.9),(6,88,6346,6995,6127.04,6152.16),(7,114,8075,6275,10663.9,9969.63),(8,131,7048,7138,12408.6,12326.8),(9,123,7023,9034,5179.6,5341.17),(10,172,12639,16170,15337.2,15249.2),(11,134,12710,12920,11093.7,10739.7),(12,125,10370,9293,3747.44,4158),(13,38,3343,2720,6772.56,6228.55),(14,88,5644,7053,12621.4,11792.1),(15,45,3124,3107,3808.36,3972.57),(16,147,9880,8472,5680.7,6103.01),(17,32,2650,2564,3484.11,3421.69),(18,184,16067,15471,8295.1,9202.3),(19,70,6035,6228,6625.59,6316.06),(20,122,8993,10103,9886.21,9502.08),(21,89,7703,5711,4477.02,4803.2),(22,196,12260,16477,14330.1,15614.9),(23,189,14776,12496,17888.7,17603.2),(24,35,3027,2145,4055.78,3729.04),(25,102,8976,8324,7978.35,8308.91),(26,83,7773,4717,5441.01,6022.73),(27,22,1541,1434,1637.79,1567.53),(28,89,6904,5137,5199.24,5615.86),(29,66,4279,5259,7391.1,7226.07),(30,118,7221,7932,8487.95,7893.35),(31,136,9649,7453,11820.6,12282.4),(32,58,4739,3194,5677.44,5254.27),(33,137,11354,12398,9486.11,8964.22),(34,102,7538,6328,8732.99,8539.12),(35,203,18177,13450,8442.08,9018.13),(36,120,10986,9261,8613.32,9301.92),(37,102,8444,7118,7913.75,7212.04),(38,113,9950,10599,14381.8,14262.7),(39,74,4722,5631,8154.62,7612.44),(40,77,4950,5321,6748.84,7274.65),(41,60,3778,4168,4440.34,4896.66),(42,170,15063,11349,13517.2,15006.3),(43,114,9837,7356,8702.22,9076.98),(44,58,5422,5434,4813.95,4831.74),(45,63,5025,4492,5923.28,6142.78),(46,116,6446,10702,7390.75,6796.3),(47,175,11330,14355,10128.7,10960.5),(48,113,7358,9066,5096.4,5639.08),(49,86,7304,7541,5877.03,5512.68),(50,129,8235,7248,9694.11,9439.01),(51,225,20350,13599,14617,13990.3),(52,78,4946,5658,4552.09,4998.74),(53,152,10520,8611,17267,16728.2),(54,77,5288,6023,5537.82,5211.14),(55,122,11083,8024,13126.2,14200.8),(56,111,6848,8177,13265.2,12121),(57,57,4951,4693,3943.59,3695.06),(58,81,5790,6331,8062.22,7996.53),(59,111,9131,8317,12458.3,11454.3),(60,63,4259,4353,6518.11,6758.22),(61,61,5532,5356,6040.66,5702.81),(62,155,11889,10954,10019.8,10208.5),(63,80,6290,7062,6916.87,7336.58),(64,73,6030,4263,7605.2,8432.75),(65,61,5660,4081,7851.85,7432.32),(66,52,4398,3402,7154.66,7388.21),(67,85,6591,7192,5963.72,5868.46),(68,57,5160,3387,4224.97,4617.47),(69,121,10085,11072,11722.6,12001.8),(70,77,7280,4952,8510.89,8649.07),(71,91,8041,6824,11206.8,10770.2),(72,81,6031,5604,11262.5,11270.1),(73,49,3977,4550,6712.32,6304.67),(74,133,9723,10096,11078.4,12219.8),(75,96,6151,6328,10394.4,11486.3),(76,6,395,415,5976.75,5936.97),(77,96,8802,7441,5733.06,5898.67),(78,24,1292,1745,4315.48,4303.87),(79,43,3344,3580,8907.9,8998.49),(80,81,7108,5272,10663.9,11126.4),(81,60,4440,4188,10892,10077.6),(82,46,4087,4242,7309,7370.93),(83,75,5702,5275,9410.65,9263.13),(84,38,2377,2895,4991.3,5357.55),(85,89,8268,6515,8163.85,8625.28),(86,112,9072,8828,11177.8,11467.5),(87,88,6081,8064,8737.62,8127.23),(88,79,4291,7063,8024.6,8359.2),(89,84,6152,6202,7528.59,7895.72),(90,72,4851,6081,8232.11,7689.95),(91,149,9707,10594,8416.68,8163.4),(92,111,9203,6975,8681.11,8372.47),(93,62,5603,4782,8184.24,7823.22),(94,90,5943,8014,10518.5,10517.5),(95,113,8196,6887,8380.73,8912.98),(96,39,3220,2612,4436.55,4153.61),(97,22,1448,1884,2522.84,2539.12),(98,131,7048,7138,12907.9,12326.8),(99,102,8444,7118,7274.69,7212.04),(100,116,6446,10702,7219.67,6796.3),(101,225,20350,13599,15161.1,13990.3),(102,81,6031,5604,11763.2,11270.1),(103,49,3977,4550,6929.48,6304.67);
/*!40000 ALTER TABLE `emissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flight`
--

DROP TABLE IF EXISTS `flight`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flight` (
  `fid` int NOT NULL AUTO_INCREMENT,
  `flight_id` varchar(100) DEFAULT NULL,
  `airline_id` varchar(100) DEFAULT NULL,
  `flight_number` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`fid`)
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flight`
--

LOCK TABLES `flight` WRITE;
/*!40000 ALTER TABLE `flight` DISABLE KEYS */;
INSERT INTO `flight` VALUES (1,'FL001','AI','AI101'),(2,'FL002','BA','BA202'),(3,'FL003','AI','AI102'),(4,'FL004','CA','CA303'),(5,'FL005','DA','DA404'),(6,'FL006','BA','BA205'),(7,'FL007','CA','CA307'),(8,'FL008','AI','AI108'),(9,'FL009','DA','DA409'),(10,'FL010','BA','BA210'),(11,'FL011','UA','UA150'),(12,'FL012','EK','EK703'),(13,'FL013','DL','DL202'),(14,'FL014','QR','QR360'),(15,'FL015','SQ','SQ456'),(16,'FL016','AF','AF999'),(17,'FL017','JL','JL370'),(18,'FL018','EY','EY150'),(19,'FL019','TK','TK101'),(20,'FL020','AA','AA230'),(21,'FL021','AI','AI201'),(22,'FL022','BA','BA302'),(23,'FL023','DL','DL403'),(24,'FL024','UA','UA504'),(25,'FL025','EK','EK605'),(26,'FL026','AI','AI706'),(27,'FL027','CA','CA807'),(28,'FL028','DA','DA908'),(29,'FL029','BA','BA110'),(30,'FL030','UA','UA220'),(31,'FL031','SQ','SQ330'),(32,'FL032','QR','QR440'),(33,'FL033','AF','AF550'),(34,'FL034','JL','JL660'),(35,'FL035','EY','EY770'),(36,'FL036','TK','TK880'),(37,'FL037','AA','AA990'),(38,'FL038','AI','AI1010'),(39,'FL039','BA','BA2020'),(40,'FL040','DL','DL2030'),(41,'FL041','UA','UA2040'),(42,'FL042','EK','EK2050'),(43,'FL043','AI','AI2060'),(44,'FL044','CA','CA2070'),(45,'FL045','DA','DA2080'),(46,'FL046','BA','BA2090'),(47,'FL047','UA','UA2100'),(48,'FL048','SQ','SQ2110'),(49,'FL049','QR','QR2120'),(50,'FL050','AF','AF2130'),(51,'FL051','AI','AI2160'),(52,'FL052','JL','JL301'),(53,'FL053','EY','EY320'),(54,'FL054','TK','TK450'),(55,'FL055','AA','AA560'),(56,'FL056','AI','AI670'),(57,'FL057','BA','BA780'),(58,'FL058','DL','DL890'),(59,'FL059','UA','UA901'),(60,'FL060','EK','EK1011'),(61,'FL061','AI','AI1111'),(62,'FL062','CA','CA1212'),(63,'FL063','DA','DA1313'),(64,'FL064','BA','BA1414'),(65,'FL065','SQ','SQ1515'),(66,'FL066','QR','QR1616'),(67,'FL067','AF','AF1717'),(68,'FL068','JL','JL1818'),(69,'FL069','EY','EY1919'),(70,'FL070','TK','TK2020'),(71,'FL071','AA','AA2121'),(72,'FL072','AI','AI2172'),(73,'FL073','AI','AI2173'),(74,'FL074','BA','BA2200'),(75,'FL075','UA','UA2201'),(76,'FL076','EK','EK2220'),(77,'FL077','AI','AI2230'),(78,'FL078','AI','AI2240'),(79,'FL079','BA','BA2250'),(80,'FL080','DA','DA2260'),(81,'FL081','DA','DA2270'),(82,'FL082','QR','QR2280'),(83,'FL083','CA','CA2290'),(84,'FL084','AI','AI2300'),(85,'FL085','BA','BA2310'),(86,'FL086','AI','AI2320'),(87,'FL087','UA','UA2330'),(88,'FL088','DA','DA2340'),(89,'FL089','AI','AI2350'),(90,'FL090','AI','AI2360'),(91,'FL091','UA','UA2370'),(92,'FL092','AI','AI2380'),(93,'FL093','BA','BA2390'),(94,'FL094','SQ','SQ2400'),(95,'FL095','TK','TK2410');
/*!40000 ALTER TABLE `flight` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flight_cabin`
--

DROP TABLE IF EXISTS `flight_cabin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flight_cabin` (
  `class_id` int NOT NULL,
  `class_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`class_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flight_cabin`
--

LOCK TABLES `flight_cabin` WRITE;
/*!40000 ALTER TABLE `flight_cabin` DISABLE KEYS */;
INSERT INTO `flight_cabin` VALUES (1,'Economy'),(2,'Premium Economy'),(3,'Bussiness'),(4,'First Class'),(5,'Business Plus'),(6,'Luxury Class');
/*!40000 ALTER TABLE `flight_cabin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flight_icao`
--

DROP TABLE IF EXISTS `flight_icao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flight_icao` (
  `fi_id` int NOT NULL AUTO_INCREMENT,
  `flight_schedule_id` int DEFAULT NULL,
  `gcd` float NOT NULL,
  `aircraft_type` varchar(100) DEFAULT NULL,
  `fuel_consumption` float NOT NULL,
  `aircraft_weight` float DEFAULT NULL,
  PRIMARY KEY (`fi_id`)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flight_icao`
--

LOCK TABLES `flight_icao` WRITE;
/*!40000 ALTER TABLE `flight_icao` DISABLE KEYS */;
INSERT INTO `flight_icao` VALUES (1,1,1148.09,'Boeing 777',1800.5,242000),(2,2,5540.05,'Airbus A380',2800.25,560000),(3,3,6734.23,'Bombardier CRJ900',850,76000),(4,4,3178.77,'Cessna Citation X',600,16000),(5,5,8013.65,'Boeing 747',2300.5,400000),(6,6,4567.89,'Embraer E190',1100.2,51000),(7,7,3919.42,'Airbus A330',1400.2,200000),(8,8,2105.5,'McDonnell Douglas MD-80',1300.5,67500),(9,9,266.99,'Cessna 172',50,1500),(10,10,7214.25,'Boeing 787',1500.4,227000),(11,11,3974.18,'Airbus A380',2800.25,560000),(12,12,1927.69,'ATR 72',700,13000),(13,13,3125.7,'Boeing 737',1350.1,88000),(14,14,13347.9,'Airbus A350',2000.35,280000),(15,15,6294.21,'Boeing 787',1500.4,227000),(16,16,449.21,'Pilatus PC-12',400,10000),(17,17,8753.31,'Boeing 747',2300.5,400000),(18,18,1972.17,'Dash 8 Q400',850,13000),(19,19,2219.03,'Airbus A320',1200.3,78000),(20,20,1983.1,'Boeing 737 MAX',1250.1,87000),(21,21,832.37,'Cessna Citation Latitude',500,15000),(22,22,8618.31,'Boeing 747',2300.5,400000),(23,23,975.44,'Airbus A319',1150,70000),(24,24,1930.84,'Gulfstream G650',650,20000),(25,25,11645.1,'Airbus A380',2800.25,560000),(26,26,3956,'Boeing 787',1500.4,227000),(27,27,13576.9,'Airbus A350',2000.35,280000),(28,28,2226.28,'Embraer E175',950,42000),(29,29,6344.57,'Boeing 767',1400.5,180000),(30,30,3974.18,'Airbus A380',2800.25,560000),(31,31,2564.55,'Boeing 737 MAX',1250.1,87000),(32,32,2751.43,'ATR 72',700,13000),(33,33,347.06,'Cessna 172',50,1500),(34,34,7832.45,'McDonnell Douglas DC-10',2100.5,250000),(35,35,116.76,'Beechcraft King Air 350',450,7000),(36,36,2466.44,'Boeing 737',1350.1,88000),(37,37,1174.52,'Embraer Phenom 300',650,8000),(38,38,4154.06,'Airbus A320',1200.3,78000),(39,39,5540.05,'Airbus A380',2800.25,560000),(40,40,960.98,'Boeing 737 MAX',1250.1,87000),(41,41,266.99,'Cessna 172',50,1500),(42,42,5497.36,'Airbus A330',1400.2,200000),(43,43,1930.84,'Gulfstream G550',700,21000),(44,44,4155.35,'Boeing 787',1500.4,227000),(45,45,5920.79,'McDonnell Douglas MD-11',2500,285000),(46,46,1079.27,'Bombardier Challenger 650',550,15000),(47,47,1091.93,'Airbus A320',1200.3,78000),(48,48,1024.63,'Beechcraft King Air 250',400,6500),(49,49,9576.44,'Boeing 747',2300.5,400000),(50,50,2802.03,'Boeing 737',1350.1,88000),(51,51,1753.6,'Airbus A320',1200.3,78000),(52,52,1148.09,'Beechcraft King Air 350',450,7000),(53,53,347.06,'Cessna 172',50,1500),(54,54,4567.89,'Embraer E190',1100.2,51000),(55,55,9612.45,'Boeing 767',1400.5,180000),(56,56,2317.43,'Cessna Citation CJ3',500,13500),(57,57,6384.55,'Airbus A350',2000.35,280000),(58,58,4967.22,'Boeing 757',1300.4,116000),(59,59,1946.18,'Dash 8 Q400',850,13000),(60,60,8574.32,'Boeing 777',1800.5,242000),(61,61,675.12,'Pilatus PC-12',400,10000),(62,62,2150.75,'Gulfstream G650',650,20000),(63,63,3167.45,'Boeing 737 MAX',1250.1,87000),(64,64,7430.68,'Airbus A380',2800.25,560000),(65,65,4568.9,'Embraer E175',950,42000),(66,66,7321.12,'McDonnell Douglas MD-11',2500,285000),(67,67,582.45,'Cessna Citation Latitude',500,15000),(68,68,2183.14,'Boeing 737',1350.1,88000),(69,69,6375.68,'Boeing 787',1500.4,227000),(70,70,1148.09,'Cessna 172',50,1500),(71,71,9500.24,'Boeing 747',2300.5,400000),(72,72,8930.19,'Boeing 777',1800.5,242000),(73,73,2542.47,'Airbus A320',1200.3,78000),(74,74,8562.38,'Boeing 787',1500.4,227000),(75,75,9317.15,'Airbus A380',2800.25,560000),(76,76,1148.09,'Bombardier CRJ700',850.4,33000),(77,77,2038.02,'Embraer E195',900.2,44000),(78,78,2157.38,'Airbus A220',1150.3,61000),(79,79,2365.52,'Boeing 757',1300.4,116000),(80,80,10198.2,'McDonnell Douglas DC-10',2200.5,258000),(81,81,1123.85,'Pilatus PC-12',400.3,11000),(82,82,8352.46,'Boeing 787',1500.4,227000),(83,83,6763.36,'Cessna Citation CJ4',500.1,13800),(84,84,2587.38,'Boeing 737 MAX',1350.4,87000),(85,85,5412.25,'Airbus A321',1250.3,85000),(86,86,3345.26,'Boeing 737',1350.5,88000),(87,87,2132.24,'Gulfstream G550',700.2,19000),(88,88,7812.26,'Airbus A330',1400.2,200000),(89,89,6217.54,'Boeing 777',1800.5,242000),(90,90,2365.52,'Dash 8 Q400',850.2,13200),(91,91,9083.9,'Airbus A380',2800.25,560000),(92,92,2750.41,'Boeing 737',1350.1,88000),(93,93,2308.44,'Airbus A310',1300.3,164000),(94,94,7916.14,'Boeing 757',1300.4,116000),(95,95,347.057,'Cessna 172',50.4,1500),(96,96,1148.09,'Boeing 777',1800.5,242000),(97,97,5540.05,'Airbus A380',2800.25,560000),(98,98,2105.5,'McDonnell Douglas MD-80',1300.5,67500),(99,99,1174.52,'Embraer Phenom 300',650,8000),(100,100,1079.27,'Bombardier Challenger 650',550,15000),(101,101,1753.6,'Airbus A320',1200.3,78000),(102,102,8930.19,'Boeing 777',1800.5,242000),(103,103,2542.47,'Airbus A320',1200.3,78000);
/*!40000 ALTER TABLE `flight_icao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flight_schedule`
--

DROP TABLE IF EXISTS `flight_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flight_schedule` (
  `schedule_id` int NOT NULL AUTO_INCREMENT,
  `flight_id` varchar(10) DEFAULT NULL,
  `airline_id` varchar(10) DEFAULT NULL,
  `depart_airport_id` varchar(10) DEFAULT NULL,
  `arrival_airport_id` varchar(10) DEFAULT NULL,
  `scheduled_departure_time` time DEFAULT NULL,
  `scheduled_arrival_time` time DEFAULT NULL,
  `frequency` enum('daily','weekly') DEFAULT NULL,
  `capacity` int DEFAULT NULL,
  PRIMARY KEY (`schedule_id`)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flight_schedule`
--

LOCK TABLES `flight_schedule` WRITE;
/*!40000 ALTER TABLE `flight_schedule` DISABLE KEYS */;
INSERT INTO `flight_schedule` VALUES (1,'FL001','AI','DEL','BOM','15:30:00','16:30:00','daily',180),(2,'FL002','BA','LHR','JFK','18:45:00','20:45:00','daily',220),(3,'FL003','AI','DEL','LHR','19:00:00','21:00:00','daily',200),(4,'FL004','CA','BLR','SIN','09:15:00','11:15:00','daily',150),(5,'FL005','DA','CDG','MAA','10:30:00','12:30:00','daily',250),(6,'FL006','BA','LHR','DEL','17:30:00','19:30:00','daily',180),(7,'FL007','CA','SIN','BOM','20:15:00','22:15:00','daily',160),(8,'FL008','AI','DEL','CDG','12:45:00','14:45:00','daily',200),(9,'FL009','DA','MAA','BLR','21:00:00','23:00:00','daily',230),(10,'FL010','BA','LHR','BOM','14:45:00','16:45:00','daily',210),(11,'FL011','UA','JFK','LAX','22:00:00','01:00:00','daily',250),(12,'FL012','EK','DXB','BOM','05:30:00','07:00:00','daily',300),(13,'FL013','DL','ATL','LAX','09:00:00','12:00:00','daily',280),(14,'FL014','QR','DOH','LAX','13:00:00','16:00:00','daily',200),(15,'FL015','SQ','SIN','SYD','14:30:00','17:30:00','daily',300),(16,'FL016','AF','CDG','FRA','08:00:00','10:00:00','daily',190),(17,'FL017','JL','NRT','LAX','23:15:00','01:15:00','daily',320),(18,'FL018','EY','AUH','BOM','11:00:00','13:00:00','daily',210),(19,'FL019','TK','IST','CDG','15:45:00','18:45:00','daily',230),(20,'FL020','AA','DFW','LAX','16:00:00','18:00:00','daily',150),(21,'FL021','AI','BOM','BLR','08:15:00','10:15:00','daily',170),(22,'FL022','BA','LHR','SFO','19:15:00','21:15:00','daily',240),(23,'FL023','DL','ATL','ORD','09:30:00','12:00:00','daily',250),(24,'FL024','UA','ORD','MIA','14:00:00','16:30:00','daily',220),(25,'FL025','EK','DXB','MEL','17:00:00','07:30:00','daily',300),(26,'FL026','AI','BLR','HKG','20:30:00','23:30:00','daily',210),(27,'FL027','CA','SIN','SFO','11:45:00','14:45:00','daily',180),(28,'FL028','DA','MAA','BKK','18:30:00','20:00:00','daily',250),(29,'FL029','BA','LHR','ORD','13:15:00','15:45:00','daily',230),(30,'FL030','UA','JFK','LAX','21:15:00','00:30:00','daily',250),(31,'FL031','SQ','SIN','HKG','10:00:00','13:00:00','daily',300),(32,'FL032','QR','DOH','IST','09:00:00','11:00:00','daily',200),(33,'FL033','AF','CDG','LHR','16:00:00','17:00:00','daily',190),(34,'FL034','JL','NRT','SYD','23:15:00','07:00:00','daily',320),(35,'FL035','EY','AUH','DXB','11:00:00','12:30:00','daily',210),(36,'FL036','TK','IST','LGW','08:00:00','10:00:00','daily',190),(37,'FL037','AA','DFW','ATL','23:15:00','01:15:00','daily',320),(38,'FL038','AI','DEL','SIN','14:30:00','16:30:00','daily',200),(39,'FL039','BA','LHR','JFK','15:45:00','18:45:00','daily',230),(40,'FL040','DL','ATL','MIA','16:00:00','18:00:00','daily',150),(41,'FL041','AI','BLR','MAA','07:00:00','08:30:00','daily',180),(42,'FL042','BA','LHR','DXB','12:00:00','20:00:00','daily',220),(43,'FL043','DL','ORD','MIA','19:45:00','21:15:00','daily',200),(44,'FL044','UA','JFK','SFO','10:15:00','13:00:00','daily',250),(45,'FL045','EK','DXB','HKG','14:30:00','17:30:00','daily',300),(46,'FL046','AI','DEL','KHI','18:00:00','19:30:00','daily',170),(47,'FL047','CA','SIN','SGN','09:00:00','11:00:00','daily',150),(48,'FL048','DA','MAA','BOM','11:00:00','12:00:00','daily',250),(49,'FL049','BA','LHR','BKK','15:00:00','18:00:00','daily',220),(50,'FL050','UA','ORD','LAX','20:00:00','22:00:00','daily',230),(51,'FL051','AI','DEL','MAA','14:00:00','16:20:00','daily',250),(52,'FL052','AI','DEL','BOM','08:30:00','09:30:00','daily',180),(53,'FL053','AI','DEL','BOM','12:30:00','13:30:00','daily',180),(54,'FL054','AI','DEL','BOM','18:30:00','19:30:00','daily',180),(55,'FL055','BA','LHR','JFK','18:45:00','20:45:00','daily',220),(56,'FL056','AA','LHR','JFK','18:45:00','20:45:00','daily',220),(57,'FL057','DL','LHR','JFK','18:45:00','20:45:00','daily',220),(58,'FL058','EK','DXB','LHR','06:30:00','11:00:00','daily',300),(59,'FL059','BA','CDG','LHR','08:00:00','09:30:00','daily',200),(60,'FL060','AA','JFK','LHR','14:00:00','02:00:00','daily',270),(61,'FL061','AI','DEL','BOM','10:00:00','11:00:00','daily',180),(62,'FL062','AI','DEL','BOM','14:00:00','15:00:00','daily',180),(63,'FL063','AI','DEL','BOM','20:00:00','21:00:00','daily',180),(64,'FL064','CA','SIN','NRT','09:15:00','14:15:00','daily',250),(65,'FL065','SQ','SIN','NRT','09:15:00','14:15:00','daily',250),(66,'FL066','DL','ORD','LAX','08:00:00','10:00:00','daily',220),(67,'FL067','UA','DEN','LAX','08:30:00','10:00:00','daily',210),(68,'FL068','AA','DFW','LAX','07:45:00','10:00:00','daily',250),(69,'FL069','DL','ATL','MIA','17:15:00','19:15:00','daily',150),(70,'FL070','DL','ATL','MIA','19:00:00','21:00:00','daily',150),(71,'FL071','DL','ATL','MIA','20:30:00','22:30:00','daily',150),(72,'FL072','AI','DEL','HKG','22:00:00','06:00:00','daily',250),(73,'FL073','AI','DEL','KHI','10:30:00','12:00:00','daily',170),(74,'FL074','BA','BOM','HKG','14:00:00','20:00:00','daily',200),(75,'FL075','UA','BOM','ORD','19:15:00','21:15:00','daily',230),(76,'FL076','EK','BLR','DXB','15:00:00','17:00:00','daily',300),(77,'FL077','AI','BLR','SIN','18:30:00','21:30:00','daily',180),(78,'FL078','AI','HYD','DEL','05:45:00','07:30:00','daily',200),(79,'FL079','BA','HYD','LHR','20:15:00','22:15:00','daily',220),(80,'FL080','DA','MAA','CDG','09:00:00','11:00:00','daily',250),(81,'FL081','DA','MAA','DXB','13:30:00','16:00:00','daily',300),(82,'FL082','QR','CCU','DOH','17:30:00','19:30:00','daily',220),(83,'FL083','CA','CCU','BKK','23:00:00','03:00:00','daily',180),(84,'FL084','AI','PNQ','BOM','10:15:00','11:00:00','daily',170),(85,'FL085','BA','PNQ','DXB','14:00:00','15:45:00','daily',200),(86,'FL086','AI','JAI','DEL','07:30:00','09:00:00','daily',150),(87,'FL087','UA','JAI','BOM','18:45:00','20:30:00','daily',160),(88,'FL088','DA','COK','BOM','11:15:00','12:30:00','daily',220),(89,'FL089','AI','COK','HKG','16:30:00','20:30:00','daily',200),(90,'FL090','AI','ATQ','DEL','07:00:00','08:30:00','daily',180),(91,'FL091','UA','ATQ','DXB','22:00:00','01:30:00','daily',200),(92,'FL092','AI','LKO','DEL','09:45:00','11:00:00','daily',170),(93,'FL093','BA','LKO','BOM','15:15:00','17:00:00','daily',190),(94,'FL094','SQ','SIN','HKG','10:30:00','13:30:00','daily',300),(95,'FL095','TK','IST','CDG','16:15:00','19:15:00','daily',250),(96,'FL001','AI','BOM','DEL','17:00:00','19:15:00','daily',180),(97,'FL002','AI','LHR','DEL','21:15:00','23:00:00','daily',200),(98,'FL008','AI','CDG','DEL','15:30:00','17:15:00','daily',200),(99,'FL037','AI','SIN','DEL','16:15:00','19:15:00','daily',320),(100,'FL046','AI','KHI','DEL','20:15:00','22:00:00','daily',170),(101,'FL051','AI','MAA','DEL','18:15:00','19:45:00','daily',250),(102,'FL072','AI','HKG','DEL','16:15:00','03:15:00','daily',250),(103,'FL073','AI','KHI','DEL','13:15:00','15:00:00','daily',170);
/*!40000 ALTER TABLE `flight_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `load_factors`
--

DROP TABLE IF EXISTS `load_factors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `load_factors` (
  `lf_id` int NOT NULL AUTO_INCREMENT,
  `origin` varchar(255) DEFAULT NULL,
  `destination` varchar(255) DEFAULT NULL,
  `passenger_load_factor` decimal(5,2) DEFAULT NULL,
  `cargo_load_factor` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`lf_id`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `load_factors`
--

LOCK TABLES `load_factors` WRITE;
/*!40000 ALTER TABLE `load_factors` DISABLE KEYS */;
INSERT INTO `load_factors` VALUES (1,'DEL','BOM',80.00,55.00),(2,'LHR','JFK',75.00,60.00),(3,'DEL','LHR',72.50,65.00),(4,'BLR','SIN',85.00,70.00),(5,'CDG','MAA',70.00,50.00),(6,'LHR','DEL',68.00,62.00),(7,'SIN','BOM',78.00,58.00),(8,'DEL','CDG',73.00,67.00),(9,'MAA','BLR',82.00,72.00),(10,'LHR','BOM',74.00,66.00),(11,'JFK','LAX',76.00,65.00),(12,'DXB','BOM',79.00,54.00),(13,'ATL','LAX',77.50,68.00),(14,'DOH','LAX',81.00,63.00),(15,'SIN','SYD',84.00,55.00),(16,'CDG','FRA',75.00,52.00),(17,'NRT','LAX',78.00,66.00),(18,'AUH','BOM',80.00,58.00),(19,'IST','CDG',69.00,48.00),(20,'DFW','LAX',83.00,60.00),(21,'BOM','BLR',71.00,64.00),(22,'LHR','SFO',76.50,59.00),(23,'ATL','ORD',75.00,61.00),(24,'ORD','MIA',72.50,55.00),(25,'DXB','MEL',77.00,57.00),(26,'BLR','HKG',81.00,62.00),(27,'SIN','SFO',80.00,58.00),(28,'MAA','BKK',82.00,63.00),(29,'LHR','ORD',73.00,64.00),(30,'SIN','HKG',84.00,69.00),(31,'DOH','IST',68.00,53.00),(32,'CDG','LHR',70.00,50.00),(33,'NRT','SYD',79.00,66.00),(34,'AUH','DXB',75.00,54.00),(35,'IST','LGW',71.00,49.00),(36,'DFW','ATL',82.00,61.00),(37,'DEL','SIN',78.00,68.00),(38,'ATL','MIA',76.00,57.00),(39,'BLR','MAA',74.00,55.00),(40,'LHR','DXB',85.00,72.00),(41,'JFK','SFO',77.50,60.00),(42,'DXB','HKG',73.00,59.00),(43,'DEL','KHI',71.00,50.00),(44,'SIN','SGN',80.00,55.00),(45,'MAA','BOM',68.00,48.00),(46,'LHR','BKK',79.00,64.00),(47,'ORD','LAX',74.00,56.00),(48,'DEL','MAA',76.00,52.00),(49,'DXB','LHR',78.00,67.00),(50,'JFK','LHR',82.00,62.00),(51,'SIN','NRT',75.00,63.00),(52,'DEN','LAX',80.00,54.00),(53,'DEL','HKG',70.00,59.00),(54,'BOM','HKG',72.00,55.00),(55,'BOM','ORD',81.00,58.00),(56,'BLR','DXB',77.00,60.00),(57,'HYD','DEL',74.00,53.00),(58,'HYD','LHR',75.00,54.00),(59,'MAA','CDG',73.00,51.00),(60,'MAA','DXB',76.00,59.00),(61,'CCU','DOH',78.00,60.00),(62,'CCU','BKK',72.00,57.00),(63,'PNQ','BOM',80.00,62.00),(64,'PNQ','DXB',81.00,64.00),(65,'JAI','DEL',73.00,55.00),(66,'JAI','BOM',79.00,68.00),(67,'COK','BOM',75.00,59.00),(68,'COK','HKG',76.00,60.00),(69,'ATQ','DEL',82.00,63.00),(70,'ATQ','DXB',70.00,50.00),(71,'LKO','DEL',73.00,54.00),(72,'LKO','BOM',74.00,55.00),(73,'BOM','DEL',75.00,55.00),(74,'CDG','DEL',72.50,60.00),(75,'SIN','DEL',78.00,58.00),(76,'KHI','DEL',70.00,50.00),(77,'HKG','DEL',73.00,55.00),(78,'MAA','DEL',82.00,70.00);
/*!40000 ALTER TABLE `load_factors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `y_seat`
--

DROP TABLE IF EXISTS `y_seat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `y_seat` (
  `cabin_class_id` int NOT NULL,
  `factor` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`cabin_class_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `y_seat`
--

LOCK TABLES `y_seat` WRITE;
/*!40000 ALTER TABLE `y_seat` DISABLE KEYS */;
INSERT INTO `y_seat` VALUES (1,1.00),(2,1.50),(3,2.00),(4,3.00),(5,2.50),(6,3.50);
/*!40000 ALTER TABLE `y_seat` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-17 22:10:54
