const html = `<!DOCTYPE html>
<html lang="sk">
<head>
<title>Auto bazár | Bazoš.sk</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="description" content="Auto bazár zadarmo. Vyberajte z 236 412 inzerátov. Predaj ľahko a rýchlo na Bazoš.sk. Cez 400 tisíc užívateľov za deň."><link rel="canonical" href="https://auto.bazos.sk/"><meta property="fb:admins" content="1055875657">
<link rel="stylesheet" href="https://www.bazos.sk/bazos64s.css" type="text/css"><link rel="preload" as="image" href="https://www.bazos.sk/obrazky/bazos.svg">
<link rel="stylesheet" href="https://www.bazos.sk/bazosprint.css" type="text/css" media="print">
<link rel="icon" href="https://www.bazos.sk/favicon.svg" type="image/svg+xml">
<link rel="icon" HREF="https://www.bazos.sk/favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="https://www.bazos.sk/apple-touch-icon.png">

<script>
var xhr = new XMLHttpRequest();
var naseptavac_value = '';
function naseptavac(value) {
  if (value=='')  {
  	naseptavac_value = '';
  	document.getElementById('vysledek').innerHTML='';
  	}
else {
	if (naseptavac_value == value) {
		return false;
	}
	naseptavac_value = value;
	setTimeout(function () {
		if (naseptavac_value != value) {
			return false;
		}
		xhr.onreadystatechange = function() {
 		 if (this.readyState == 4 && naseptavac_value == value){
				document.getElementById('vysledek').innerHTML = this.responseText;
			}
 		 };
		xhr.open("POST", '/suggest.php');
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.send('rubnas=AU&catnas=&qnas='+encodeURIComponent(naseptavac_value));
	}, 250);
}
}

var naseptavacpsc_value = '';
function naseptavacpsc(value) {
  if (value=='')  {
  	naseptavacpsc_value = '';
  	document.getElementById('vysledekpsc').innerHTML='<table cellpadding=\"3\" cellspacing=\"0\" class=\"tablenaspsc\"><tr><td class=\"act\" onclick=\"getLocation();\"><b>Inzeráty v okolí</b></td></tr></table>';
  	}
else {
	if (naseptavacpsc_value == value) {
		return false;
	}
	naseptavacpsc_value = value;
	setTimeout(function () {
		if (naseptavacpsc_value != value) {
			return false;
		}
		xhr.onreadystatechange = function() {
 		 if (this.readyState == 4 && naseptavacpsc_value == value){
				document.getElementById('vysledekpsc').innerHTML = this.responseText;
			}
 		 };
		xhr.open("POST", '/suggestpsc.php');
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.send('qnaspsc='+encodeURIComponent(naseptavacpsc_value));
	}, 250);
}
}

function getLocation() {
if (navigator.geolocation) {navigator.geolocation.getCurrentPosition(showPosition);}
else {document.getElementById('hlokalita').value = '';}
}
function showPosition(position) {
		xhr.onreadystatechange = function() {
 		 if (this.readyState == 4){
				document.getElementById('hlokalita').value = this.responseText;
				document.forms['formt'].submit();
			}
 		 };
		xhr.open("POST", '/zip.php');
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.send('latitude='+encodeURIComponent(position.coords.latitude)+'&longitude='+encodeURIComponent(position.coords.longitude));
}

var agent_value = '';
function agentclick() {
  if (document.getElementById('agentmail').value=='')  {
  	document.getElementById("agentmail").focus();
    return false;
  	}
else {
agent_value = document.getElementById('agentmail').value;
xhr.onreadystatechange = function() {
  if (this.readyState == 4){
				document.getElementById('overlay').innerHTML = this.responseText;
			}
  };
xhr.open("POST", '/agent.php');
xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
xhr.send('hledat=&rubrikav=AU&hlokalita=&humkreis=&cenaod=&cenado=&cat=&typ=&agentmail='+encodeURIComponent(agent_value));
}
}

function odeslatrequest(value,params) {
xhr.onreadystatechange = function() {
  if (this.readyState == 4){
				document.getElementById('overlay').innerHTML = this.responseText;
			}
  };
xhr.open("POST", value);
xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
xhr.send(params);
}
function overlay() {
	el = document.getElementById("overlay");
	el.style.display = (el.style.display == "inline") ? "none" : "inline";
}
function odeslatakci(postaction,value1,value2,value3) {
document.getElementById('postaction').value = postaction;
document.getElementById("postv1").value = value1;
document.getElementById("postv2").value = value2;
document.getElementById("postv3").value = value3;
document.formaction.submit();
}
</script>
</head>

<body>

<div class="sirka">


<div class="listalogor">
<div class="listalogol"><a href="https://www.bazos.sk/" title="Bazos.sk - Inzercia, inzeráty"><img src="https://www.bazos.sk/obrazky/bazos.svg" width="199" height="34" alt="Bazos.sk - Inzercia, inzeráty"></a></div>
<div class="listalogom"><b>... bazár pre každého</b></div>
<div class="listalogop"><a href="https://www.bazos.sk/oblubene.php"><b>Obľúbené inzeráty</b></a> <a href="https://www.bazos.sk/moje-inzeraty.php"><b>Moje inzeráty</b></a> <a href="/pridat-inzerat.php"><b><span class=pridati>Pridať inzerát</span></b></a></div>
</div>
<form name="formt" id="formt" method=get >
<div class="listah">
<div class="rubriky">
<b>
Čo: <span class=vysokoli><span id="vysledek"></span><input type="search" onkeyup="naseptavac(this.value);" id=hledat name=hledat size="17" maxlength="256" value="" autocomplete="off" title="Čo? Hľadaný výraz"></span>

<select name="rubriky" onchange='this.form.submit();' title="Vyber rubriku">
<option value="www">Všetky rubriky</option>
<option value="auto" selected>Auto</option><option value="deti">Deti</option><option value="dom">Dom a záhrada</option><option value="elektro">Elektro</option><option value="foto">Foto</option><option value="hudba">Hudba</option><option value="knihy">Knihy</option><option value="mobil">Mobily</option><option value="motocykle">Motocykle</option><option value="nabytok">Nábytok</option><option value="oblecenie">Oblečenie</option><option value="pc">PC</option><option value="praca">Práca</option><option value="reality">Reality</option><option value="sluzby">Služby</option><option value="stroje">Stroje</option><option value="sport">Šport</option><option value="vstupenky">Vstupenky</option><option value="zvierata">Zvieratá</option><option value="ostatne">Ostatné</option></select>

PSČ (miesto): <span class=vysokolipsc><span id="vysledekpsc"></span><input type="search" name="hlokalita" id="hlokalita" onkeyup="naseptavacpsc(this.value);" onclick="naseptavacpsc(this.value);" value="" size="5" maxlength="25" autocomplete="off" title="Kde? PSČ (miesto)" style="-webkit-appearance: none;"></span>
Okolie: <input name="humkreis" title="Okolie v km" value="25" size="3" style="width: 25px;"> km
Cena od: <input name=cenaod title="Cena od €" maxlength="12" size="4" value=""> - do: <input name=cenado title="Cena do €" maxlength="12" size="4" value=""> €  <input type="submit" name="Submit" value="Hľadať">
<input type="hidden" name="order" id="order"><input type="hidden" name="crp" id="crp"><input type="hidden" id="kitx" name="kitx" value="ano"></b>
</div>
</div>
</form>
<div class="drobky"><a href=https://www.bazos.sk/>Hlavná stránka</a>  > <h1 class="nadpiskategorie">Auto</h1></div>
<br>


<div class="flexmain"><div class="menuleft"><div class="nadpismenu">Osobné autá</div>
<div class="barvalmenu">
<div class="barvaleva">
<a href="/alfa/" >Alfa Romeo</a>
<a href="/audi/" >Audi</a>
<a href="/bmw/" >BMW</a>
<a href="/citroen/" >Citroën</a>
<a href="/dacia/" >Dacia</a>
<a href="/fiat/" >Fiat</a>
<a href="/ford/" >Ford</a>
<a href="/honda/" >Honda</a>
<a href="/hyundai/" >Hyundai</a>
<a href="/chevrolet/" >Chevrolet</a>
<a href="/kia/" >Kia</a>
<a href="/mazda/" >Mazda</a>
<a href="/mercedes/" >Mercedes-Benz</a>
<a href="/mitsubishi/" >Mitsubishi</a>
<a href="/nissan/" >Nissan</a>
<a href="/opel/" >Opel</a>
<a href="/peugeot/" >Peugeot</a>
<a href="/renault/" >Renault</a>
<a href="/seat/" >Seat</a>
<a href="/suzuki/" >Suzuki</a>
<a href="/skoda/" >Škoda</a>
<a href="/toyota/" >Toyota</a>
<a href="/volkswagen/" >Volkswagen</a>
<a href="/volvo/" >Volvo</a>
<a href="/ostatni/" >Ostatné značky</a>
<br>
<a href="https://elektro.bazos.sk/autoradia/">Autorádiá</a>
<a href="https://pc.bazos.sk/gps/">GPS navigácia</a>
<a href="/havarovana/" >Havarované</a>
<a href="/nahradnidily/" >Náhradné diely</a>
<a href="/pneumatiky/" >Pneumatiky, kolesá</a>
<a href="/prislusenstvo/" >Príslušenstvo</a>
<a href="/tuning/" >Tuning</a>
<a href="/veterany/" >Veterány</a>
</div></div>

<br>
<div class="nadpismenu">Úžitkové automobily</div>
<div class="barvalmenu">
<div class="barvaleva">
<a href="/autobusy/" >Autobusy</a>
<a href="/dodavka/" >Dodávky</a>
<a href="/mikrobus/" >Mikrobusy</a>
<a href="/karavany/" >Karavany, vozíky</a>
<a href="/nakladne/" >Nákladné autá</a>
<a href="/pickup/" >Pick-up</a>
<a href="https://stroje.bazos.sk/">Stroje</a>
<a href="/ostatniuzitkova/" >Ostatné</a>
<br>
<a href="/havarovanauzitkova/" >Havarované</a>
<a href="/nahradnidilyuzitkova/" >Náhradné diely</a>
</div></div>
<br>
<div class="nadpismenu">Moto</div>
<div class="barvalmenu">
<div class="barvaleva">
<a href="https://motocykle.bazos.sk/">Motocykle, Skútre</a>
</div></div>
</div><div class="maincontent">


<div class="listainzerat inzeratyflex">
<div class="inzeratynadpis"><img src="https://www.bazos.sk/obrazky/list.gif" width="18" height="16" alt="List inzerátov" class=gallerylista> <form name="formgal" id="formgal" method="post" style="display: inline;"><input type="hidden" name="gal" value="g"><input type="image" alt="Submit" src="https://www.bazos.sk/obrazky/gallery.gif" width="18" height="16" class="gallerylist inputgal"></form> Zobrazených 1-20 inzerátov z 236 412</div>
<div class="inzeratycena"><b><span onclick="document.getElementById('order').value=1;document.forms['formt'].submit();" class="paction">Cena</span></b></div>
<div class="inzeratylok">Lokalita</div>
<div class="inzeratyview"><span onclick="document.getElementById('order').value=3;document.forms['formt'].submit();" class="paction">Zobrazenie</span></div>
</div><form name="formaction" method="post" style="display: inline;"><input type="hidden" id="postaction" name="postaction" value=""><input type="hidden" id="postv1" name="postv1" value=""><input type="hidden" id="postv2" name="postv2" value=""><input type="hidden" id="postv3" name="postv3" value=""></form><button type="button" onclick="odeslatrequest('/agent.php','teloverit=');overlay();">Nové inzeráty e-mailom</button>
	<div id="overlay">
     <div></div>
</div>

<div id="container_one"></div>

<div class="inzeraty inzeratyflex">
<div class="inzeratynadpis"><a href="/inzerat/172430669/seat-tarraco-20-tdi-150-style-family-dsg.php"><img src="https://www.bazos.sk/img/1t/669/172430669.jpg?t=1733145051" class="obrazek" alt="Seat Tarraco 2.0 TDI 150 Style Family DSG" width="145" height="109"></a>
<h2 class=nadpis><a href="/inzerat/172430669/seat-tarraco-20-tdi-150-style-family-dsg.php">Seat Tarraco 2.0 TDI 150 Style Family DSG</a></h2><span class=velikost10> - <span title="TOP 21x Platí do 13.1. 2025" class="ztop">TOP</span> - [2.12. 2024]</span><br>
<div class=popis>TECHNICKÉ ÚDAJE: R.V.: 8/2021, 1968CM3, 110KW (150PS), P, A7, DIESEL, EURO 6, 5 DV., (5-MIESTNE), 155616 KM


SPOTREBA VOZIDLA (L/100KM): V MESTE: 5.8, MIMO MESTA: 4.3, KOMBINOVANÁ: 4.9


BEZPEČNOSŤ: ABS, ADAPTÍVNY TEMPOMAT, NATÁČACIE SVETLOMETY, ADS, AIRBAGY, AIRBAG 8X, ALARM, ASR, BRZDOVÝ AS ...</div><br><br>
</div>
<div class="inzeratycena"><b>  21 950 €</b></div>
<div class="inzeratylok">Nitra<br>949 01</div>
<div class="inzeratyview">105 x</div>
<div class="inzeratyakce">
<span onclick="odeslatakci('spam','172430669');return false;" class="akce paction">Označiť zlý inzerát</span> <span onclick="odeslatakci('category','172430669');return false;" class="akce paction">Chybnú kategóriu</span> <span onclick="odeslatakci('rating','2058881','16286','DACAR+s.r.o.');return false;" class="akce paction">Ohodnotiť užívateľa</span> <span onclick="odeslatakci('edit','172430669');return false;" class="akce paction">Zmazať/Upraviť/Topovať</span>
</div>
</div>

<div class="inzeraty inzeratyflex">
<div class="inzeratynadpis"><a href="/inzerat/172436675/skoda-rapid-16-tdi-m5-elegance-r16-original-km.php"><img src="https://www.bazos.sk/img/1t/675/172436675.jpg?t=1733143924" class="obrazek" alt="Škoda Rapid 1.6 TDI M5 Elegance R16 Originál KM" width="145" height="109"></a>
<h2 class=nadpis><a href="/inzerat/172436675/skoda-rapid-16-tdi-m5-elegance-r16-original-km.php">Škoda Rapid 1.6 TDI M5 Elegance R16 Originál KM</a></h2><span class=velikost10> - <span title="TOP 21x Platí do 13.1. 2025" class="ztop">TOP</span> - [2.12. 2024]</span><br>
<div class=popis>Technické údaje:
r.v.: 09/2015, 1598cm3, 77kW (105PS), P, Manuálna prevodovka 5.st, Diesel, Euro 5, 5 dv., (5-miestne), 167 156 km, Čierna Metalíza

Spotreba vozidla (l/100km):
V meste: 5.6, mimo mesta: 3.7, kombinovaná: 4.4

Bezpečnosť:
ABS, Airbagy, Airbag 9x, Alarm, ASR, Brzdový asistent,  ...</div><br><br>
</div>
<div class="inzeratycena"><b>  6 250 €</b></div>
<div class="inzeratylok">Partizánske<br>958 01</div>
<div class="inzeratyview">166 x</div>
<div class="inzeratyakce">
<span onclick="odeslatakci('spam','172436675');return false;" class="akce paction">Označiť zlý inzerát</span> <span onclick="odeslatakci('category','172436675');return false;" class="akce paction">Chybnú kategóriu</span> <span onclick="odeslatakci('rating','4866996','3403537','+');return false;" class="akce paction">Ohodnotiť užívateľa</span> <span onclick="odeslatakci('edit','172436675');return false;" class="akce paction">Zmazať/Upraviť/Topovať</span>
</div>
</div>

<div class="inzeraty inzeratyflex">
<div class="inzeratynadpis"><a href="/inzerat/172436225/skoda-octavia-iv-combi-20-tdi-110-kw-dsg-2021-virtual-f1.php"><img src="https://www.bazos.sk/img/1t/225/172436225.jpg?t=1733143871" class="obrazek" alt="Škoda Octavia IV Combi 2.0 TDi 110 KW DSG 2021 Virtual F1" width="145" height="109"></a>
<h2 class=nadpis><a href="/inzerat/172436225/skoda-octavia-iv-combi-20-tdi-110-kw-dsg-2021-virtual-f1.php">Škoda Octavia IV Combi 2.0 TDi 110 KW DSG 2021 Virtual F1</a></h2><span class=velikost10> - <span title="TOP 21x Platí do 13.1. 2025" class="ztop">TOP</span> - [2.12. 2024]</span><br>
<div class=popis>Ponúkam na predaj Škoda Octavia 4 Combi 2.0 TDi Ambition DSG 

Vozidlo je max. zachované, pravidelne servisované podľa plánu údržby. Naposledy vykonaný servis 11.2024:
Výmena náplni a filtrov v motore aj v prevodovke, výmena rozvodov.
Auto nebolo nikdy búrané ani striekané, je vo výbornom technickom ...</div><br><br>
</div>
<div class="inzeratycena"><b>  14 990 €</b></div>
<div class="inzeratylok">Šaľa<br>927 01</div>
<div class="inzeratyview">187 x</div>
<div class="inzeratyakce">
<span onclick="odeslatakci('spam','172436225');return false;" class="akce paction">Označiť zlý inzerát</span> <span onclick="odeslatakci('category','172436225');return false;" class="akce paction">Chybnú kategóriu</span> <span onclick="odeslatakci('rating','0','2390437','Nori');return false;" class="akce paction">Ohodnotiť užívateľa</span> <span onclick="odeslatakci('edit','172436225');return false;" class="akce paction">Zmazať/Upraviť/Topovať</span>
</div>
</div>

<div class="inzeraty inzeratyflex">
<div class="inzeratynadpis"><a href="/inzerat/172435721/seat-alhambra-4x4-110kw.php"><img src="https://www.bazos.sk/img/1t/721/172435721.jpg?t=1733143671" class="obrazek" alt="SEAT ALHAMBRA 4x4 110kW..." width="145" height="109"></a>
<h2 class=nadpis><a href="/inzerat/172435721/seat-alhambra-4x4-110kw.php">SEAT ALHAMBRA 4x4 110kW...</a></h2><span class=velikost10> - <span title="TOP 21x Platí do 13.1. 2025" class="ztop">TOP</span> - [2.12. 2024]</span><br>
<div class=popis>OBJEM: 1968 CM3, 110KW/150PS, NAFTA, 6 ST.MANUÁLNA PREVODOVKA, 5 MIESTNA, R.V.12/2016, 225000KM, VIN: NA VYŽIADANIE, POHON: 4x4 4DRIVE (4MOTION), 3. ZÓN. AUT. KLIMATIZÁCIA, EL. OKNÁ, CÚV. SENZORY VPREDU-VZADU, PREDOHREV WEBASTO, TEMPOMAT, VYHR. SEDADLÁ, FÓLIE..., FACELIFT MODEL, NUTNÉ VIDIEŤ NAŽIVO, ...</div><br><br>
</div>
<div class="inzeratycena"><b>  12 490 €</b></div>
<div class="inzeratylok">Nitra<br>951 36</div>
<div class="inzeratyview">71 x</div>
<div class="inzeratyakce">
<span onclick="odeslatakci('spam','172435721');return false;" class="akce paction">Označiť zlý inzerát</span> <span onclick="odeslatakci('category','172435721');return false;" class="akce paction">Chybnú kategóriu</span> <span onclick="odeslatakci('rating','0','2730197','CARS');return false;" class="akce paction">Ohodnotiť užívateľa</span> <span onclick="odeslatakci('edit','172435721');return false;" class="akce paction">Zmazať/Upraviť/Topovať</span>
</div>
</div>

<div class="inzeraty inzeratyflex">
<div class="inzeratynadpis"><a href="/inzerat/172434927/seat-ateca-15tsi-150ps-rv1572019-dsg-tazne.php"><img src="https://www.bazos.sk/img/1t/927/172434927.jpg?t=1733141473" class="obrazek" alt="Seat ateca 1.5Tsi-150ps-RV:15.7.2019-DSG-Tažne" width="145" height="109"></a>
<h2 class=nadpis><a href="/inzerat/172434927/seat-ateca-15tsi-150ps-rv1572019-dsg-tazne.php">Seat ateca 1.5Tsi-150ps-RV:15.7.2019-DSG-Tažne</a></h2><span class=velikost10> - <span title="TOP 21x Platí do 13.1. 2025" class="ztop">TOP</span> - [2.12. 2024]</span><br>
<div class=popis>Možný leasing/autoúver od 0% akontácie
Seat ateca 1.5Tsi-150ps-RV:15.7.2019-DSG-Tažne

Rok výroby: 15.7.2019
Najazdené km: 173 727
Výkon: 110 kW
Objem: 1495
Palivo: Benzín
Prevodovka: automatická 7-stupňová
VIN: VSSZZZ5FZK6587884

....SUPER MOTOR VHODNY AJ DO MESTA A KRATKE TRASY.....SERV ...</div><br><br>
</div>
<div class="inzeratycena"><b>  15 500 €</b></div>
<div class="inzeratylok">Poprad<br>058 01</div>
<div class="inzeratyview">134 x</div>
<div class="inzeratyakce">
<span onclick="odeslatakci('spam','172434927');return false;" class="akce paction">Označiť zlý inzerát</span> <span onclick="odeslatakci('category','172434927');return false;" class="akce paction">Chybnú kategóriu</span> <span onclick="odeslatakci('rating','3679856','1802225','AutoPallen');return false;" class="akce paction">Ohodnotiť užívateľa</span> <span onclick="odeslatakci('edit','172434927');return false;" class="akce paction">Zmazať/Upraviť/Topovať</span>
</div>
</div>

<div class="inzeraty inzeratyflex">
<div class="inzeratynadpis"><a href="/inzerat/172434197/skoda-octavia-combi-16-tdi-dsg-f1-elegance-webasto-tazne.php"><img src="https://www.bazos.sk/img/1t/197/172434197.jpg?t=1733140468" class="obrazek" alt="Škoda Octavia Combi 1.6 TDI DSG F1 Elegance Webasto Tážné" width="145" height="109"></a>
<h2 class=nadpis><a href="/inzerat/172434197/skoda-octavia-combi-16-tdi-dsg-f1-elegance-webasto-tazne.php">Škoda Octavia Combi 1.6 TDI DSG F1 Elegance Webasto Tážné</a></h2><span class=velikost10> - <span title="TOP 21x Platí do 13.1. 2025" class="ztop">TOP</span> - [2.12. 2024]</span><br>
<div class=popis>Technické údaje:
r.v.: 02/2015, 1598cm3, 77kW (105PS), P, Automatická prevodovka, Diesel, Euro 5, 5 dv., (5-miestne), 166 289 km, Čierna Metalíza

Spotreba vozidla (l/100km):
V meste: 4.8, mimo mesta: 3.6, kombinovaná: 4

Bezpečnosť:
ABS, Natáčacie svetlomety, Airbagy, Airbag 9x, Alarm, ASR,  ...</div><br><br>
</div>
<div class="inzeratycena"><b>  8 999 €</b></div>
<div class="inzeratylok">Partizánske<br>958 01</div>
<div class="inzeratyview">202 x</div>
<div class="inzeratyakce">
<span onclick="odeslatakci('spam','172434197');return false;" class="akce paction">Označiť zlý inzerát</span> <span onclick="odeslatakci('category','172434197');return false;" class="akce paction">Chybnú kategóriu</span> <span onclick="odeslatakci('rating','4241134','2560182','+');return false;" class="akce paction">Ohodnotiť užívateľa</span> <span onclick="odeslatakci('edit','172434197');return false;" class="akce paction">Zmazať/Upraviť/Topovať</span>
</div>
</div>

<div class="inzeraty inzeratyflex">
<div class="inzeratynadpis"><a href="/inzerat/172432406/98-elektrony-original-vw-5x112-r17.php"><img src="https://www.bazos.sk/img/1t/406/172432406.jpg?t=1733137302" class="obrazek" alt="#98 Elektróny originál VW 5x112 r17" width="145" height="109"></a>
<h2 class=nadpis><a href="/inzerat/172432406/98-elektrony-original-vw-5x112-r17.php">#98 Elektróny originál VW 5x112 r17</a></h2><span class=velikost10> - <span title="TOP 21x Platí do 13.1. 2025" class="ztop">TOP</span> - [2.12. 2024]</span><br>
<div class=popis>Číslo #98

Predám čierne hliníkové disky

➡️ ‭+421 910 664 300‬ ⬅️

Rozteč 5x112
ET 40
Šírka disku 7,5j


✅ Možnosť poslať kuriérom ✅

Kolesá sú vo veľmi dobrom stave


Elektróny sú rovné, vyskúšané na vyvažovačke 

Sedia na väčšinu modelov značky Volkswagen:

Golf Passat Tiguan Jetta Touran Caddy T ...</div><br><br>
</div>
<div class="inzeratycena"><b>   399 €</b></div>
<div class="inzeratylok">Námestovo<br>029 01</div>
<div class="inzeratyview">192 x</div>
<div class="inzeratyakce">
<span onclick="odeslatakci('spam','172432406');return false;" class="akce paction">Označiť zlý inzerát</span> <span onclick="odeslatakci('category','172432406');return false;" class="akce paction">Chybnú kategóriu</span> <span onclick="odeslatakci('rating','5328923','4021493','KolesaDisky');return false;" class="akce paction">Ohodnotiť užívateľa</span> <span onclick="odeslatakci('edit','172432406');return false;" class="akce paction">Zmazať/Upraviť/Topovať</span>
</div>
</div>

<div class="inzeraty inzeratyflex">
<div class="inzeratynadpis"><a href="/inzerat/172430109/skoda-superb-combi-20-tdi-scr-style-dsg.php"><img src="https://www.bazos.sk/img/1t/109/172430109.jpg?t=1733137415" class="obrazek" alt="Škoda Superb Combi 2.0 TDI SCR Style DSG" width="145" height="109"></a>
<h2 class=nadpis><a href="/inzerat/172430109/skoda-superb-combi-20-tdi-scr-style-dsg.php">Škoda Superb Combi 2.0 TDI SCR Style DSG</a></h2><span class=velikost10> - <span title="TOP 21x Platí do 13.1. 2025" class="ztop">TOP</span> - [2.12. 2024]</span><br>
<div class=popis>Ponúkam na predaj Škodu Superb 2.0 TDI NOVÝ MODEL 2020. Auto je v stavé nového vozidla.Taktiež je pravidelne servisované a udržiavané.

Základné údaje:
r.v.: 10/2020, 1968cm3, 110 KW (150PS), Generácia vozidla: (5-miest), P,Automatická-7 stupňov , Diesel, 5 dv., 183873 km, Strieborná metalíza

 ...</div><br><br>
</div>
<div class="inzeratycena"><b>  18 100 €</b></div>
<div class="inzeratylok">Žilina<br>013 13</div>
<div class="inzeratyview">352 x</div>
<div class="inzeratyakce">
<span onclick="odeslatakci('spam','172430109');return false;" class="akce paction">Označiť zlý inzerát</span> <span onclick="odeslatakci('category','172430109');return false;" class="akce paction">Chybnú kategóriu</span> <span onclick="odeslatakci('rating','5064300','871282','Richard+');return false;" class="akce paction">Ohodnotiť užívateľa</span> <span onclick="odeslatakci('edit','172430109');return false;" class="akce paction">Zmazať/Upraviť/Topovať</span>
</div>
</div>

<div class="inzeraty inzeratyflex">
<div class="inzeratynadpis"><a href="/inzerat/172430474/seat-leon-20-tdi-170k-fr.php"><img src="https://www.bazos.sk/img/1t/474/172430474.jpg?t=1733135022" class="obrazek" alt="Seat Leon 2.0 TDI 170k FR" width="145" height="109"></a>
<h2 class=nadpis><a href="/inzerat/172430474/seat-leon-20-tdi-170k-fr.php">Seat Leon 2.0 TDI 170k FR</a></h2><span class=velikost10> - <span title="TOP 21x Platí do 13.1. 2025" class="ztop">TOP</span> - [2.12. 2024]</span><br>
<div class=popis>Technické údaje:
r.v. 1/2007, 202 209 km, diesel, 1 968 cm³ (2 l), 125 kW (170 PS), 6-st. manuálna prevodovka, predný pohon, šedá met. , , hatchback, 5 - dverové, 5 - miestne, Euro 4
Spotreba:
v meste: 7.8 l, mimo mesta: 5 l, kombinovaná: 6 l
Bezpečnosť:
ABS, ADS, airbagy, airbag 6x, ASR, brzdo ...</div><br><br>
</div>
<div class="inzeratycena"><b>  5 690 €</b></div>
<div class="inzeratylok">Prešov<br>080 01</div>
<div class="inzeratyview">481 x</div>
<div class="inzeratyakce">
<span onclick="odeslatakci('spam','172430474');return false;" class="akce paction">Označiť zlý inzerát</span> <span onclick="odeslatakci('category','172430474');return false;" class="akce paction">Chybnú kategóriu</span> <span onclick="odeslatakci('rating','0','37511','Luk%C3%A1%C5%A1');return false;" class="akce paction">Ohodnotiť užívateľa</span> <span onclick="odeslatakci('edit','172430474');return false;" class="akce paction">Zmazať/Upraviť/Topovať</span>
</div>
</div>

<div class="inzeraty inzeratyflex">
<div class="inzeratynadpis"><a href="/inzerat/172430240/volkswagen-touran-20-tdi-scr-150k-comfortline-dsg.php"><img src="https://www.bazos.sk/img/1t/240/172430240.jpg?t=1733137452" class="obrazek" alt="Volkswagen Touran 2.0 TDI SCR 150k Comfortline DSG" width="145" height="109"></a>
<h2 class=nadpis><a href="/inzerat/172430240/volkswagen-touran-20-tdi-scr-150k-comfortline-dsg.php">Volkswagen Touran 2.0 TDI SCR 150k Comfortline DSG</a></h2><span class=velikost10> - <span title="TOP 21x Platí do 13.1. 2025" class="ztop">TOP</span> - [2.12. 2024]</span><br>
<div class=popis>Ponúkam na predaj veľmi pekný VW Touran po prvom majiteľovi.Auto je veľmi pekne zachovalé, bolo pravidelne servisované, udržiavané a garážované. 

TECHNICKÉ ÚDAJE: 
r.v.: 6/2020 1968cm3, 110 KW (150PS), Generacia vozidla Van-MPV, P,Automatická -7 stupňová , Diesel, 5 dv., 176840 km, Modrá metalíz ...</div><br><br>
</div>
<div class="inzeratycena"><b>  18 450 €</b></div>
<div class="inzeratylok">Žilina<br>013 13</div>
<div class="inzeratyview">202 x</div>
<div class="inzeratyakce">
<span onclick="odeslatakci('spam','172430240');return false;" class="akce paction">Označiť zlý inzerát</span> <span onclick="odeslatakci('category','172430240');return false;" class="akce paction">Chybnú kategóriu</span> <span onclick="odeslatakci('rating','5064300','871282','Richard+');return false;" class="akce paction">Ohodnotiť užívateľa</span> <span onclick="odeslatakci('edit','172430240');return false;" class="akce paction">Zmazať/Upraviť/Topovať</span>
</div>
</div>

<div class="inzeraty inzeratyflex">
<div class="inzeratynadpis"><a href="/inzerat/172427266/skoda-superb-combi-20-tdi-140kw4x4lkdsgled-matrix.php"><img src="https://www.bazos.sk/img/1t/266/172427266.jpg?t=1733131022" class="obrazek" alt="Škoda Superb Combi 2.0 TDI 140kw/4x4/L&amp;K/DSG/LED MATRIX" width="145" height="109"></a>
<h2 class=nadpis><a href="/inzerat/172427266/skoda-superb-combi-20-tdi-140kw4x4lkdsgled-matrix.php">Škoda Superb Combi 2.0 TDI 140kw/4x4/L&amp;K/DSG/LED MATRIX</a></h2><span class=velikost10> - <span title="TOP 21x Platí do 13.1. 2025" class="ztop">TOP</span> - [2.12. 2024]</span><br>
<div class=popis>Škoda Superb Combi 2.0 TDI 190ps 4x4 L&K DSG
Rok výroby:9/2019, Najazdené km:75 500km, Farba:Čiernametalíza,,Prevodovka: Automatická - 7 stupňov, Výkon:140kW (190PS),Pohon:4x4,
Stav vozidla: Ako nové kúpené v SR,Nebúrané ,Prvý majiteľ,Servisná knižka,V zárukeÚplná servisná história,Automatická tro ...</div><br><br>
</div>
<div class="inzeratycena"><b>  28 000 €</b></div>
<div class="inzeratylok">Komárno<br>945 01</div>
<div class="inzeratyview">405 x</div>
<div class="inzeratyakce">
<span onclick="odeslatakci('spam','172427266');return false;" class="akce paction">Označiť zlý inzerát</span> <span onclick="odeslatakci('category','172427266');return false;" class="akce paction">Chybnú kategóriu</span> <span onclick="odeslatakci('rating','3907540','3766360','Beke');return false;" class="akce paction">Ohodnotiť užívateľa</span> <span onclick="odeslatakci('edit','172427266');return false;" class="akce paction">Zmazať/Upraviť/Topovať</span>
</div>
</div>

<div class="inzeraty inzeratyflex">
<div class="inzeratynadpis"><a href="/inzerat/172375699/2015-skoda-superb-combi-20-tdi-dsg-bohata-vybava.php"><img src="https://www.bazos.sk/img/1t/699/172375699.jpg?t=1733123458" class="obrazek" alt="Škoda Superb Combi 2.0 TDI DSG | nové rozvody, bohatá výbava" width="145" height="109"></a>
<h2 class=nadpis><a href="/inzerat/172375699/2015-skoda-superb-combi-20-tdi-dsg-bohata-vybava.php">Škoda Superb Combi 2.0 TDI DSG | nové rozvody, bohatá výbava</a></h2><span class=velikost10> - <span title="TOP 21x Platí do 13.1. 2025" class="ztop">TOP</span> - [2.12. 2024]</span><br>
<div class=popis>✅Úplná servisná história 
✅Originálne kilometre
✅Možnosť financovania

Ponúkame na predaj Škoda Superb v karosárskej verzii kombi, r.v. 11/2015, modelový rok 2016, s naftovým motorom 2.0 TDI s výkonom 110 kW/150 koní v kombinácii so 6-st. automatickou prevodovkou DSG v krásnej bielej metalíze.
 ...</div><br><br>
</div>
<div class="inzeratycena"><b>  14 590 €</b></div>
<div class="inzeratylok">Nitra<br>949 01</div>
<div class="inzeratyview">965 x</div>
<div class="inzeratyakce">
<span onclick="odeslatakci('spam','172375699');return false;" class="akce paction">Označiť zlý inzerát</span> <span onclick="odeslatakci('category','172375699');return false;" class="akce paction">Chybnú kategóriu</span> <span onclick="odeslatakci('rating','4949679','1862550','AUTOBONO.sk');return false;" class="akce paction">Ohodnotiť užívateľa</span> <span onclick="odeslatakci('edit','172375699');return false;" class="akce paction">Zmazať/Upraviť/Topovať</span>
</div>
</div>

<div class="inzeraty inzeratyflex">
<div class="inzeratynadpis"><a href="/inzerat/172299536/2019-seat-leon-combi-20-tdi-110-kw-full-serviska.php"><img src="https://www.bazos.sk/img/1t/536/172299536.jpg?t=1733123237" class="obrazek" alt="2019 Seat Leon Combi 2.0 TDI 110 kW | full serviska [DPH]" width="145" height="109"></a>
<h2 class=nadpis><a href="/inzerat/172299536/2019-seat-leon-combi-20-tdi-110-kw-full-serviska.php">2019 Seat Leon Combi 2.0 TDI 110 kW | full serviska [DPH]</a></h2><span class=velikost10> - <span title="TOP 21x Platí do 13.1. 2025" class="ztop">TOP</span> - [2.12. 2024]</span><br>
<div class=popis>✅Odpočet DPH
✅Úplná servisná história
✅Originálne kilometre
✅Možnosť financovania

Ponúkame na predaj Seat Leon v karosárskej verzii kombi Sportstourer, r.v. 09/2019, modelový rok 2020, s naftovým motorom 2.0 TDI s výkonom 110 kW/150 koní v kombinácii so 6-st. manuálnou prevodovkou. Auto bolo p ...</div><br><br>
</div>
<div class="inzeratycena"><b>  10 940 €</b></div>
<div class="inzeratylok">Nitra<br>949 01</div>
<div class="inzeratyview">492 x</div>
<div class="inzeratyakce">
<span onclick="odeslatakci('spam','172299536');return false;" class="akce paction">Označiť zlý inzerát</span> <span onclick="odeslatakci('category','172299536');return false;" class="akce paction">Chybnú kategóriu</span> <span onclick="odeslatakci('rating','4949679','1862550','AUTOBONO.sk');return false;" class="akce paction">Ohodnotiť užívateľa</span> <span onclick="odeslatakci('edit','172299536');return false;" class="akce paction">Zmazať/Upraviť/Topovať</span>
</div>
</div>

<div class="inzeraty inzeratyflex">
<div class="inzeratynadpis"><a href="/inzerat/172410636/ford-fiesta-14tdci-rv-22011-kupene-sr.php"><img src="https://www.bazos.sk/img/1t/636/172410636.jpg?t=1733090351" class="obrazek" alt="Ford Fiesta 1.4TDCI, rv 2/2011, kúpené SR" width="145" height="109"></a>
<h2 class=nadpis><a href="/inzerat/172410636/ford-fiesta-14tdci-rv-22011-kupene-sr.php">Ford Fiesta 1.4TDCI, rv 2/2011, kúpené SR</a></h2><span class=velikost10> - <span title="TOP 21x Platí do 12.1. 2025" class="ztop">TOP</span> - [2.12. 2024]</span><br>
<div class=popis>Predám Ford Fiesta 6-tej generácie so spoľahlivým a úsporným dieslovým motorom 1.4 TDCI o výkone 51kw. Kupované na Slovensku po 2-hej majiteľke. Rok výroby 2/2011. Stk/ek platné do 8/2025. Najazdené len 151 000 kilometrov. 2x klúč....



Výbava: ABS,airbag, imobilizér, isofix, výškovo nastaviteľ ...</div><br><br>
</div>
<div class="inzeratycena"><b>  3 900 €</b></div>
<div class="inzeratylok">Zvolen<br>960 01</div>
<div class="inzeratyview">701 x</div>
<div class="inzeratyakce">
<span onclick="odeslatakci('spam','172410636');return false;" class="akce paction">Označiť zlý inzerát</span> <span onclick="odeslatakci('category','172410636');return false;" class="akce paction">Chybnú kategóriu</span> <span onclick="odeslatakci('rating','0','4076719','MH');return false;" class="akce paction">Ohodnotiť užívateľa</span> <span onclick="odeslatakci('edit','172410636');return false;" class="akce paction">Zmazať/Upraviť/Topovať</span>
</div>
</div>

<div class="inzeraty inzeratyflex">
<div class="inzeratynadpis"><a href="/inzerat/172410225/skoda-superb-combi-20-tdi-scr-sportline-dsg-2021-matrix.php"><img src="https://www.bazos.sk/img/1t/225/172410225.jpg?t=1733086631" class="obrazek" alt="Škoda Superb Combi 2.0 TDI SCR Sportline DSG 2021 Matrix" width="145" height="109"></a>
<h2 class=nadpis><a href="/inzerat/172410225/skoda-superb-combi-20-tdi-scr-sportline-dsg-2021-matrix.php">Škoda Superb Combi 2.0 TDI SCR Sportline DSG 2021 Matrix</a></h2><span class=velikost10> - <span title="TOP 21x Platí do 12.1. 2025" class="ztop">TOP</span> - [2.12. 2024]</span><br>
<div class=popis>Značka:Škoda,Model:Superb Sportline 147kw Combi,Mesiac / Rok:
2021,Palivo:Diesel,Prevodovka:7-st. automatická,Najazdené km:184200km,Objem:1968 cm3,Farba:šeda.
Bezpečnosť:

ABS, Adaptívny tempomat, Natáčacie svetlomety, ADS, Airbagy, Airbag 10x, Alarm, ASR, Brzdový asistent, Centrálne zamykanie,  ...</div><br><br>
</div>
<div class="inzeratycena"><b>  23 500 €</b></div>
<div class="inzeratylok">Púchov<br>020 61</div>
<div class="inzeratyview">1845 x</div>
<div class="inzeratyakce">
<span onclick="odeslatakci('spam','172410225');return false;" class="akce paction">Označiť zlý inzerát</span> <span onclick="odeslatakci('category','172410225');return false;" class="akce paction">Chybnú kategóriu</span> <span onclick="odeslatakci('rating','3725731','171798','erik');return false;" class="akce paction">Ohodnotiť užívateľa</span> <span onclick="odeslatakci('edit','172410225');return false;" class="akce paction">Zmazať/Upraviť/Topovať</span>
</div>
</div>

<div class="inzeraty inzeratyflex">
<div class="inzeratynadpis"><a href="/inzerat/172408954/ford-c-max-16tdci-druhy-majitel-top-stav-6stupnovy-manual.php"><img src="https://www.bazos.sk/img/1t/954/172408954.jpg?t=1733084229" class="obrazek" alt="Ford C-max 1.6tdci-druhý majiteľ-Top stav-6stupňový manuál" width="145" height="109"></a>
<h2 class=nadpis><a href="/inzerat/172408954/ford-c-max-16tdci-druhy-majitel-top-stav-6stupnovy-manual.php">Ford C-max 1.6tdci-druhý majiteľ-Top stav-6stupňový manuál</a></h2><span class=velikost10> - <span title="TOP 21x Platí do 12.1. 2025" class="ztop">TOP</span> - [2.12. 2024]</span><br>
<div class=popis>Predám pekný a zachovalý Ford C-max s úsporným naftovým motorom 1.6tdci 70kw a 6stupňovou manuálnou prevodovkou. V roku 2015 bol dovezený od prvého majiteľa z Belgicka a do súčastnosti ho vlastnil na Slovensku len jeden majiteľ.

Výbava-el.okná,el.vyhrievané zrkadlá,pal.PC,2xkľúč,servisná knižka,s ...</div><br><br>
</div>
<div class="inzeratycena"><b>  4 990 €</b></div>
<div class="inzeratylok">Banská Bystrica<br>974 01</div>
<div class="inzeratyview">633 x</div>
<div class="inzeratyakce">
<span onclick="odeslatakci('spam','172408954');return false;" class="akce paction">Označiť zlý inzerát</span> <span onclick="odeslatakci('category','172408954');return false;" class="akce paction">Chybnú kategóriu</span> <span onclick="odeslatakci('rating','0','2517465','RV-cars%2C+s.+r.+o.+');return false;" class="akce paction">Ohodnotiť užívateľa</span> <span onclick="odeslatakci('edit','172408954');return false;" class="akce paction">Zmazať/Upraviť/Topovať</span>
</div>
</div>

<div class="inzeraty inzeratyflex">
<div class="inzeratynadpis"><a href="/inzerat/172408022/mercedes-benz-s350-long-182tis-km.php"><img src="https://www.bazos.sk/img/1t/022/172408022.jpg?t=1733084686" class="obrazek" alt="Mercedes-Benz S350 long--182tis km" width="145" height="109"></a>
<h2 class=nadpis><a href="/inzerat/172408022/mercedes-benz-s350-long-182tis-km.php">Mercedes-Benz S350 long--182tis km</a></h2><span class=velikost10> - <span title="TOP 21x Platí do 12.1. 2025" class="ztop">TOP</span> - [2.12. 2024]</span><br>
<div class=popis>Možný leasing/autoúver od 0% akontácie
Mercedes-Benz S350 long--182tis km

rv:2011,najazdene 182600km,garazovane,nikdy neburane-pravidelny servis.....
Auto je pekne zachovale po servise bez investicii.....
Posledny servis:novy olej v motore a prevodovke,nove vsetky filtre,novy vodny chladič,nov ...</div><br><br>
</div>
<div class="inzeratycena"><b>  16 900 €</b></div>
<div class="inzeratylok">Poprad<br>058 01</div>
<div class="inzeratyview">1768 x</div>
<div class="inzeratyakce">
<span onclick="odeslatakci('spam','172408022');return false;" class="akce paction">Označiť zlý inzerát</span> <span onclick="odeslatakci('category','172408022');return false;" class="akce paction">Chybnú kategóriu</span> <span onclick="odeslatakci('rating','3679856','1802225','AutoPallen');return false;" class="akce paction">Ohodnotiť užívateľa</span> <span onclick="odeslatakci('edit','172408022');return false;" class="akce paction">Zmazať/Upraviť/Topovať</span>
</div>
</div>

<div class="inzeraty inzeratyflex">
<div class="inzeratynadpis"><a href="/inzerat/172369843/skoda-octavia-combi-3-facelift-16-tdi-115k-style.php"><img src="https://www.bazos.sk/img/1t/843/172369843.jpg?t=1733080873" class="obrazek" alt="Škoda Octavia Combi 3 facelift 1.6 TDI 115k Style" width="145" height="109"></a>
<h2 class=nadpis><a href="/inzerat/172369843/skoda-octavia-combi-3-facelift-16-tdi-115k-style.php">Škoda Octavia Combi 3 facelift 1.6 TDI 115k Style</a></h2><span class=velikost10> - <span title="TOP 21x Platí do 12.1. 2025" class="ztop">TOP</span> - [2.12. 2024]</span><br>
<div class=popis>Škoda Octavia Combi 3 facelift 1.6 TDI 115k Style

Motor 1.6 85kw (115PS)
Prevodovka 5st manuálna
Pohon predný
Rok výroby 12/2019
Počet najazdených km 136000

2x kľúč od vozidla
Komplet servis len autorizovaný Škoda
Pôvodný lak na celom vozidle 
Výbava:
Led denné svietenie
Halogénové sv ...</div><br><br>
</div>
<div class="inzeratycena"><b>  13 000 €</b></div>
<div class="inzeratylok">Banská Bystrica<br>974 11</div>
<div class="inzeratyview">693 x</div>
<div class="inzeratyakce">
<span onclick="odeslatakci('spam','172369843');return false;" class="akce paction">Označiť zlý inzerát</span> <span onclick="odeslatakci('category','172369843');return false;" class="akce paction">Chybnú kategóriu</span> <span onclick="odeslatakci('rating','3151050','47675','Octavia');return false;" class="akce paction">Ohodnotiť užívateľa</span> <span onclick="odeslatakci('edit','172369843');return false;" class="akce paction">Zmazať/Upraviť/Topovať</span>
</div>
</div>

<div class="inzeraty inzeratyflex">
<div class="inzeratynadpis"><a href="/inzerat/172370161/skoda-octavia-combi-3-facelift-16-tdi-115k-style-dsg.php"><img src="https://www.bazos.sk/img/1t/161/172370161.jpg?t=1733080816" class="obrazek" alt="Škoda Octavia Combi 3 facelift 1.6 TDI 115k Style DSG" width="145" height="109"></a>
<h2 class=nadpis><a href="/inzerat/172370161/skoda-octavia-combi-3-facelift-16-tdi-115k-style-dsg.php">Škoda Octavia Combi 3 facelift 1.6 TDI 115k Style DSG</a></h2><span class=velikost10> - <span title="TOP 21x Platí do 12.1. 2025" class="ztop">TOP</span> - [2.12. 2024]</span><br>
<div class=popis>Škoda Octavia Combi 3 facelift 1.6 TDI 115k Style DSG

Motor 1.6 85kw (115PS)
Prevodovka 7st automatická 
Pohon predný
Rok výroby 10/2018
Počet najazdených km 144000

2x kľúč od vozidla
Komplet servis len autorizovaný Škoda
Výbava:
Full led svetlomety
Multifunkčný volant
F1 radenie za v ...</div><br><br>
</div>
<div class="inzeratycena"><b>  13 990 €</b></div>
<div class="inzeratylok">Banská Bystrica<br>974 11</div>
<div class="inzeratyview">706 x</div>
<div class="inzeratyakce">
<span onclick="odeslatakci('spam','172370161');return false;" class="akce paction">Označiť zlý inzerát</span> <span onclick="odeslatakci('category','172370161');return false;" class="akce paction">Chybnú kategóriu</span> <span onclick="odeslatakci('rating','3151050','47675','Octavia');return false;" class="akce paction">Ohodnotiť užívateľa</span> <span onclick="odeslatakci('edit','172370161');return false;" class="akce paction">Zmazať/Upraviť/Topovať</span>
</div>
</div>

<div class="inzeraty inzeratyflex">
<div class="inzeratynadpis"><a href="/inzerat/172370264/skoda-octavia-combi-3-facelift-20-tdi-150k-style-dsg.php"><img src="https://www.bazos.sk/img/1t/264/172370264.jpg?t=1733080744" class="obrazek" alt="Škoda Octavia Combi 3 facelift 2.0 TDI 150k Style DSG" width="145" height="109"></a>
<h2 class=nadpis><a href="/inzerat/172370264/skoda-octavia-combi-3-facelift-20-tdi-150k-style-dsg.php">Škoda Octavia Combi 3 facelift 2.0 TDI 150k Style DSG</a></h2><span class=velikost10> - <span title="TOP 21x Platí do 12.1. 2025" class="ztop">TOP</span> - [2.12. 2024]</span><br>
<div class=popis>Škoda Octavia Combi 3 facelift 2.0 TDI 150k Style DSG

Motor 2.0 110kw (150PS)
Prevodovka 7st automatická
Pohon predný
Rok výroby 9/2019
Počet najazdených km 144000

2x kľúč od vozidla
Servis autorizovaný Škoda
Výbava:
RS packet
Led denné svietenie
Halogénové svetlomety
Multifunkčný vo ...</div><br><br>
</div>
<div class="inzeratycena"><b>  13 500 €</b></div>
<div class="inzeratylok">Banská Bystrica<br>974 11</div>
<div class="inzeratyview">828 x</div>
<div class="inzeratyakce">
<span onclick="odeslatakci('spam','172370264');return false;" class="akce paction">Označiť zlý inzerát</span> <span onclick="odeslatakci('category','172370264');return false;" class="akce paction">Chybnú kategóriu</span> <span onclick="odeslatakci('rating','3151050','47675','Octavia');return false;" class="akce paction">Ohodnotiť užívateľa</span> <span onclick="odeslatakci('edit','172370264');return false;" class="akce paction">Zmazať/Upraviť/Topovať</span>
</div>
</div>
<div id="container_two"></div><br><div class="strankovani">Stránka: <b><span class=cisla>1</span></b> <a href="/20/">2</a> <a href="/40/">3</a> <a href="/60/">4</a> <a href="/80/">5</a> <a href="/100/">6</a> <a href="/120/">7</a> <a href="/140/">8</a> <a href="/20/"><b>Ďalšia</b></a></div><br><br><br>


</div></div><br>

&copy;2024 Bazoš - <b>Inzercia, bazár </b><br>
<a href="https://www.bazos.sk/pomoc.php">Pomoc</a>, <a href="https://www.bazos.sk/otazky.php">Otázky</a>, <a href="https://www.bazos.sk/hodnotenie.php">Hodnotenie</a>, <a href="https://www.bazos.sk/kontakt.php">Kontakt</a>, <a href="https://www.bazos.sk/reklama.php">Reklama</a>, <a href="https://www.bazos.sk/podmienky.php">Podmienky</a>, <a href="https://www.bazos.sk/ochrana-udajov.php">Ochrana údajov</a>, <a href="https://www.bazos.sk/rss.php?rub=au">RSS</a>, <form name="formvkm" id="formvkm" method="post" style="display: inline;"><input type="hidden" name="vkm" value="m"><input type="submit" class="vkm" value="Mobilná verzia"></form><br>

Inzeráty Auto celkom: <b>236413</b>, za 24 hodín: <b>14628</b><br><br>
<a href="https://www.bazos.sk/mapa-kategorie.php">Mapa kategórií</a>, <a href="https://auto.bazos.sk/mapa-search.php">Najvyhľadávanejšie výrazy</a>
<br>
Krajiny: <a href="https://auto.bazos.sk">Slovensko</a>, <a href="https://auto.bazos.cz">Česká republika</a>, <a href="https://auto.bazos.pl">Poľsko</a>, <a href="https://auto.bazos.at">Rakúsko</a>
<br>
<br>
</div>

<script type="text/javascript" src="https://www.bazos.sk/cookie-consent.js" charset="UTF-8"></script>
<script type="text/javascript" charset="UTF-8">
document.addEventListener('DOMContentLoaded', function () {
cookieconsent.run({"notice_banner_type":"simple","consent_type":"express","palette":"light","language":"sk","page_load_consent_levels":["strictly-necessary"],"notice_banner_reject_button_hide":false,"preferences_center_close_button_hide":false,"page_refresh_confirmation_buttons":false,"cookie_domain": "bazos.sk"});
});
</script>
<a href="#" id="open_preferences_center"> </a>

<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-HLZSNE9Z0C"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-HLZSNE9Z0C');
</script>

</body>
</html>`


export default html;