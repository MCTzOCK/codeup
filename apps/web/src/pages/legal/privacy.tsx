/**
 * apps/web/src/pages/legal/privacy.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.12.2022
 *
 */

import * as React from "react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Select,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import Head from "next/head";
import makeRequest from "@codeup/rest/dist/makeRequest";
import DividerWithText from "@codeup/components/dist/global/DividerWithText";
import { CHeading } from "@codeup/components/dist/global/CHeading";

export default function Imprint() {
  return (
    <>
      <Head>
        <title>Datenschutzerklärung - CodeUp</title>
      </Head>
      <Flex
        align="center"
        justify="center"
        w={"100%"}
        minH={"100vh"}
        h={"fit-content"}
        bg={"#000"}
        pt={6}
        pb={6}
      >
        <Stack
          spacing={8}
          w="100%"
          maxW="800px"
          p={8}
          bgColor={["transparent", "gray.900"]}
          rounded="lg"
          shadow={["none", "xl"]}
        >
          <CHeading size={"2xl"}>Datenschutzerklärung</CHeading>
          <>
            <Heading size="lg" color="brand.500">
              1. Datenschutz auf einen Blick
            </Heading>
            <Heading size="lg" color="brand.500">
              Allgemeine Hinweise
            </Heading>
            &nbsp;
            <Text>
              Die folgenden Hinweise geben einen einfachen Überblick darüber,
              was mit Ihren personenbezogenen Daten passiert, wenn Sie diese
              Website besuchen. Personenbezogene Daten sind alle Daten, mit
              denen Sie persönlich identifiziert werden können. Ausführliche
              Informationen zum Thema Datenschutz entnehmen Sie unserer unter
              diesem Text aufgeführten Datenschutzerklärung.
            </Text>
            <Heading size="lg" color="brand.500">
              Datenerfassung auf dieser Website
            </Heading>
            &nbsp;
            <Heading size="md" color="brand.500">
              Wer ist verantwortlich für die Datenerfassung auf dieser Website?
            </Heading>
            &nbsp;
            <Text>
              Die Datenverarbeitung auf dieser Website erfolgt durch den
              Websitebetreiber. Dessen Kontaktdaten können Sie dem Abschnitt
              „Hinweis zur Verantwortlichen Stelle“ in dieser
              Datenschutzerklärung entnehmen.
            </Text>
            &nbsp;
            <Heading size="md" color="brand.500">
              Wie erfassen wir Ihre Daten?
            </Heading>
            &nbsp;
            <Text>
              Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese
              mitteilen. Hierbei kann es sich z.&nbsp;B. um Daten handeln, die
              Sie in ein Kontaktformular eingeben.
            </Text>
            &nbsp;
            <Text>
              Andere Daten werden automatisch oder nach Ihrer Einwilligung beim
              Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor
              allem technische Daten (z.&nbsp;B. Internetbrowser, Betriebssystem
              oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten
              erfolgt automatisch, sobald Sie diese Website betreten.
            </Text>
            &nbsp;
            <Heading size="md" color="brand.500">
              Wofür nutzen wir Ihre Daten?
            </Heading>
            &nbsp;
            <Text>
              Ein Teil der Daten wird erhoben, um eine fehlerfreie
              Bereitstellung der Website zu gewährleisten. Andere Daten können
              zur Analyse Ihres Nutzerverhaltens verwendet werden.
            </Text>
            &nbsp;
            <Heading size="md" color="brand.500">
              Welche Rechte haben Sie bezüglich Ihrer Daten?
            </Heading>
            &nbsp;
            <Text>
              Sie haben jederzeit das Recht, unentgeltlich Auskunft über
              Herkunft, Empfänger und Zweck Ihrer gespeicherten
              personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht,
              die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie
              eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie
              diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem
              haben Sie das Recht, unter bestimmten Umständen die Einschränkung
              der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Des
              Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen
              Aufsichtsbehörde zu.
            </Text>
            &nbsp;
            <Text>
              Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie
              sich jederzeit an uns wenden.
            </Text>
            <Heading size="lg" color="brand.500">
              Analyse-Tools und Tools von Dritt­anbietern
            </Heading>
            &nbsp;
            <Text>
              Beim Besuch dieser Website kann Ihr Surf-Verhalten statistisch
              ausgewertet werden. Das geschieht vor allem mit sogenannten
              Analyseprogrammen.
            </Text>
            &nbsp;
            <Text>
              Detaillierte Informationen zu diesen Analyseprogrammen finden Sie
              in der folgenden Datenschutzerklärung.
            </Text>
            <Heading size="lg" color="brand.500">
              2. Allgemeine Hinweise und Pflicht­informationen
            </Heading>
            <Heading size="lg" color="brand.500">
              Datenschutz
            </Heading>
            &nbsp;
            <Text>
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen
              Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten
              vertraulich und entsprechend den gesetzlichen
              Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </Text>
            &nbsp;
            <Text>
              Wenn Sie diese Website benutzen, werden verschiedene
              personenbezogene Daten erhoben. Personenbezogene Daten sind Daten,
              mit denen Sie persönlich identifiziert werden können. Die
              vorliegende Datenschutzerklärung erläutert, welche Daten wir
              erheben und wofür wir sie nutzen. Sie erläutert auch, wie und zu
              welchem Zweck das geschieht.
            </Text>
            &nbsp;
            <Text>
              Wir weisen darauf hin, dass die Datenübertragung im Internet
              (z.&nbsp;B. bei der Kommunikation per E-Mail) Sicherheitslücken
              aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff
              durch Dritte ist nicht möglich.
            </Text>
            <Heading size="lg" color="brand.500">
              Hinweis zur verantwortlichen Stelle
            </Heading>
            &nbsp;
            <Text>
              Die verantwortliche Stelle für die Datenverarbeitung auf dieser
              Website ist:
            </Text>
            &nbsp;
            <Text>
              Ben Siebert
              <br />
              Im Mühlenwinkel 14
              <br />
              45525 Hattingen
            </Text>
            <Text>
              Telefon: 015254398340
              <br />
              E-Mail: hello@ben-siebert.de
            </Text>
            <Text>
              Verantwortliche Stelle ist die natürliche oder juristische Person,
              die allein oder gemeinsam mit anderen über die Zwecke und Mittel
              der Verarbeitung von personenbezogenen Daten (z.&nbsp;B. Namen,
              E-Mail-Adressen o. Ä.) entscheidet.
            </Text>
            <Heading size="lg" color="brand.500">
              Speicherdauer
            </Heading>
            &nbsp;
            <Text>
              Soweit innerhalb dieser Datenschutzerklärung keine speziellere
              Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen
              Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt.
              Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine
              Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten
              gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für
              die Speicherung Ihrer personenbezogenen Daten haben (z.&nbsp;B.
              steuer- oder handelsrechtliche Aufbewahrungsfristen); im
              letztgenannten Fall erfolgt die Löschung nach Fortfall dieser
              Gründe.
            </Text>
            <Heading size="lg" color="brand.500">
              Allgemeine Hinweise zu den Rechtsgrundlagen der Datenverarbeitung
              auf dieser Website
            </Heading>
            &nbsp;
            <Text>
              Sofern Sie in die Datenverarbeitung eingewilligt haben,
              verarbeiten wir Ihre personenbezogenen Daten auf Grundlage von
              Art. 6 Abs. 1 lit. a DSGVO bzw. Art. 9 Abs. 2 lit. a DSGVO, sofern
              besondere Datenkategorien nach Art. 9 Abs. 1 DSGVO verarbeitet
              werden. Im Falle einer ausdrücklichen Einwilligung in die
              Übertragung personenbezogener Daten in Drittstaaten erfolgt die
              Datenverarbeitung außerdem auf Grundlage von Art. 49 Abs. 1 lit. a
              DSGVO. Sofern Sie in die Speicherung von Cookies oder in den
              Zugriff auf Informationen in Ihr Endgerät (z.&nbsp;B. via
              Device-Fingerprinting) eingewilligt haben, erfolgt die
              Datenverarbeitung zusätzlich auf Grundlage von § 25 Abs. 1 TTDSG.
              Die Einwilligung ist jederzeit widerrufbar. Sind Ihre Daten zur
              Vertragserfüllung oder zur Durchführung vorvertraglicher Maßnahmen
              erforderlich, verarbeiten wir Ihre Daten auf Grundlage des Art. 6
              Abs. 1 lit. b DSGVO. Des Weiteren verarbeiten wir Ihre Daten,
              sofern diese zur Erfüllung einer rechtlichen Verpflichtung
              erforderlich sind auf Grundlage von Art. 6 Abs. 1 lit. c DSGVO.
              Die Datenverarbeitung kann ferner auf Grundlage unseres
              berechtigten Interesses nach Art. 6 Abs. 1 lit. f DSGVO erfolgen.
              Über die jeweils im Einzelfall einschlägigen Rechtsgrundlagen wird
              in den folgenden Absätzen dieser Datenschutzerklärung informiert.
            </Text>
            <Heading size="lg" color="brand.500">
              Hinweis zur Datenweitergabe in die USA und sonstige Drittstaaten
            </Heading>
            &nbsp;
            <Text>
              Wir verwenden unter anderem Tools von Unternehmen mit Sitz in den
              USA oder sonstigen datenschutzrechtlich nicht sicheren
              Drittstaaten. Wenn diese Tools aktiv sind, können Ihre
              personenbezogene Daten in diese Drittstaaten übertragen und dort
              verarbeitet werden. Wir weisen darauf hin, dass in diesen Ländern
              kein mit der EU vergleichbares Datenschutzniveau garantiert werden
              kann. Beispielsweise sind US-Unternehmen dazu verpflichtet,
              personenbezogene Daten an Sicherheitsbehörden herauszugeben, ohne
              dass Sie als Betroffener hiergegen gerichtlich vorgehen könnten.
              Es kann daher nicht ausgeschlossen werden, dass US-Behörden
              (z.&nbsp;B. Geheimdienste) Ihre auf US-Servern befindlichen Daten
              zu Überwachungszwecken verarbeiten, auswerten und dauerhaft
              speichern. Wir haben auf diese Verarbeitungstätigkeiten keinen
              Einfluss.
            </Text>
            <Heading size="lg" color="brand.500">
              Widerruf Ihrer Einwilligung zur Datenverarbeitung
            </Heading>
            &nbsp;
            <Text>
              Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen
              Einwilligung möglich. Sie können eine bereits erteilte
              Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der bis zum
              Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf
              unberührt.
            </Text>
            <Heading size="lg" color="brand.500">
              Widerspruchsrecht gegen die Datenerhebung in besonderen Fällen
              sowie gegen Direktwerbung (Art. 21 DSGVO)
            </Heading>
            &nbsp;
            <Text>
              WENN DIE DATENVERARBEITUNG AUF GRUNDLAGE VON ART. 6 ABS. 1 LIT. E
              ODER F DSGVO ERFOLGT, HABEN SIE JEDERZEIT DAS RECHT, AUS GRÜNDEN,
              DIE SICH AUS IHRER BESONDEREN SITUATION ERGEBEN, GEGEN DIE
              VERARBEITUNG IHRER PERSONENBEZOGENEN DATEN WIDERSPRUCH EINZULEGEN;
              DIES GILT AUCH FÜR EIN AUF DIESE BESTIMMUNGEN GESTÜTZTES
              PROFILING. DIE JEWEILIGE RECHTSGRUNDLAGE, AUF DENEN EINE
              VERARBEITUNG BERUHT, ENTNEHMEN SIE DIESER DATENSCHUTZERKLÄRUNG.
              WENN SIE WIDERSPRUCH EINLEGEN, WERDEN WIR IHRE BETROFFENEN
              PERSONENBEZOGENEN DATEN NICHT MEHR VERARBEITEN, ES SEI DENN, WIR
              KÖNNEN ZWINGENDE SCHUTZWÜRDIGE GRÜNDE FÜR DIE VERARBEITUNG
              NACHWEISEN, DIE IHRE INTERESSEN, RECHTE UND FREIHEITEN ÜBERWIEGEN
              ODER DIE VERARBEITUNG DIENT DER GELTENDMACHUNG, AUSÜBUNG ODER
              VERTEIDIGUNG VON RECHTSANSPRÜCHEN (WIDERSPRUCH NACH ART. 21 ABS. 1
              DSGVO).
            </Text>
            &nbsp;
            <Text>
              WERDEN IHRE PERSONENBEZOGENEN DATEN VERARBEITET, UM DIREKTWERBUNG
              ZU BETREIBEN, SO HABEN SIE DAS RECHT, JEDERZEIT WIDERSPRUCH GEGEN
              DIE VERARBEITUNG SIE BETREFFENDER PERSONENBEZOGENER DATEN ZUM
              ZWECKE DERARTIGER WERBUNG EINZULEGEN; DIES GILT AUCH FÜR DAS
              PROFILING, SOWEIT ES MIT SOLCHER DIREKTWERBUNG IN VERBINDUNG
              STEHT. WENN SIE WIDERSPRECHEN, WERDEN IHRE PERSONENBEZOGENEN DATEN
              ANSCHLIESSEND NICHT MEHR ZUM ZWECKE DER DIREKTWERBUNG VERWENDET
              (WIDERSPRUCH NACH ART. 21 ABS. 2 DSGVO).
            </Text>
            <Heading size="lg" color="brand.500">
              Beschwerde­recht bei der zuständigen Aufsichts­behörde
            </Heading>
            &nbsp;
            <Text>
              Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein
              Beschwerderecht bei einer Aufsichtsbehörde, insbesondere in dem
              Mitgliedstaat ihres gewöhnlichen Aufenthalts, ihres Arbeitsplatzes
              oder des Orts des mutmaßlichen Verstoßes zu. Das Beschwerderecht
              besteht unbeschadet anderweitiger verwaltungsrechtlicher oder
              gerichtlicher Rechtsbehelfe.
            </Text>
            <Heading size="lg" color="brand.500">
              Recht auf Daten­übertrag­barkeit
            </Heading>
            &nbsp;
            <Text>
              Sie haben das Recht, Daten, die wir auf Grundlage Ihrer
              Einwilligung oder in Erfüllung eines Vertrags automatisiert
              verarbeiten, an sich oder an einen Dritten in einem gängigen,
              maschinenlesbaren Format aushändigen zu lassen. Sofern Sie die
              direkte Übertragung der Daten an einen anderen Verantwortlichen
              verlangen, erfolgt dies nur, soweit es technisch machbar ist.
            </Text>
            <Heading size="lg" color="brand.500">
              Auskunft, Löschung und Berichtigung
            </Heading>
            &nbsp;
            <Text>
              Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen
              jederzeit das Recht auf unentgeltliche Auskunft über Ihre
              gespeicherten personenbezogenen Daten, deren Herkunft und
              Empfänger und den Zweck der Datenverarbeitung und ggf. ein Recht
              auf Berichtigung oder Löschung dieser Daten. Hierzu sowie zu
              weiteren Fragen zum Thema personenbezogene Daten können Sie sich
              jederzeit an uns wenden.
            </Text>
            <Heading size="lg" color="brand.500">
              Recht auf Einschränkung der Verarbeitung
            </Heading>
            &nbsp;
            <Text>
              Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer
              personenbezogenen Daten zu verlangen. Hierzu können Sie sich
              jederzeit an uns wenden. Das Recht auf Einschränkung der
              Verarbeitung besteht in folgenden Fällen:
            </Text>
            &nbsp;
            <ul>
              &nbsp;
              <li>
                Wenn Sie die Richtigkeit Ihrer bei uns gespeicherten
                personenbezogenen Daten bestreiten, benötigen wir in der Regel
                Zeit, um dies zu überprüfen. Für die Dauer der Prüfung haben Sie
                das Recht, die Einschränkung der Verarbeitung Ihrer
                personenbezogenen Daten zu verlangen.
              </li>
              &nbsp;
              <li>
                Wenn die Verarbeitung Ihrer personenbezogenen Daten unrechtmäßig
                geschah/geschieht, können Sie statt der Löschung die
                Einschränkung der Datenverarbeitung verlangen.
              </li>
              &nbsp;
              <li>
                Wenn wir Ihre personenbezogenen Daten nicht mehr benötigen, Sie
                sie jedoch zur Ausübung, Verteidigung oder Geltendmachung von
                Rechtsansprüchen benötigen, haben Sie das Recht, statt der
                Löschung die Einschränkung der Verarbeitung Ihrer
                personenbezogenen Daten zu verlangen.
              </li>
              &nbsp;
              <li>
                Wenn Sie einen Widerspruch nach Art. 21 Abs. 1 DSGVO eingelegt
                haben, muss eine Abwägung zwischen Ihren und unseren Interessen
                vorgenommen werden. Solange noch nicht feststeht, wessen
                Interessen überwiegen, haben Sie das Recht, die Einschränkung
                der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
              </li>
              &nbsp;
            </ul>
            &nbsp;
            <Text>
              Wenn Sie die Verarbeitung Ihrer personenbezogenen Daten
              eingeschränkt haben, dürfen diese Daten – von ihrer Speicherung
              abgesehen – nur mit Ihrer Einwilligung oder zur Geltendmachung,
              Ausübung oder Verteidigung von Rechtsansprüchen oder zum Schutz
              der Rechte einer anderen natürlichen oder juristischen Person oder
              aus Gründen eines wichtigen öffentlichen Interesses der
              Europäischen Union oder eines Mitgliedstaats verarbeitet werden.
            </Text>
            <Heading size="lg" color="brand.500">
              SSL- bzw. TLS-Verschlüsselung
            </Heading>
            &nbsp;
            <Text>
              Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der
              Übertragung vertraulicher Inhalte, wie zum Beispiel Bestellungen
              oder Anfragen, die Sie an uns als Seitenbetreiber senden, eine
              SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung
              erkennen Sie daran, dass die Adresszeile des Browsers von
              „http://“ auf „https://“ wechselt und an dem Schloss-Symbol in
              Ihrer Browserzeile.
            </Text>
            &nbsp;
            <Text>
              Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die
              Daten, die Sie an uns übermitteln, nicht von Dritten mitgelesen
              werden.
            </Text>
            <Heading size="lg" color="brand.500">
              3. Datenerfassung auf dieser Website
            </Heading>
            <Heading size="lg" color="brand.500">
              Cookies
            </Heading>
            &nbsp;
            <Text>
              Unsere Internetseiten verwenden so genannte „Cookies“. Cookies
              sind kleine Datenpakete und richten auf Ihrem Endgerät keinen
              Schaden an. Sie werden entweder vorübergehend für die Dauer einer
              Sitzung (Session-Cookies) oder dauerhaft (permanente Cookies) auf
              Ihrem Endgerät gespeichert. Session-Cookies werden nach Ende Ihres
              Besuchs automatisch gelöscht. Permanente Cookies bleiben auf Ihrem
              Endgerät gespeichert, bis Sie diese selbst löschen&nbsp;oder eine
              automatische Löschung durch Ihren Webbrowser erfolgt.
            </Text>
            &nbsp;
            <Text>
              Teilweise können auch Cookies von Drittunternehmen auf Ihrem
              Endgerät gespeichert werden, wenn Sie unsere Seite betreten
              (Third-Party-Cookies). Diese ermöglichen uns oder Ihnen die
              Nutzung bestimmter Dienstleistungen des Drittunternehmens
              (z.&nbsp;B. Cookies zur Abwicklung von Zahlungsdienstleistungen).
            </Text>
            &nbsp;
            <Text>
              Cookies haben verschiedene Funktionen. Zahlreiche Cookies sind
              technisch notwendig, da bestimmte Websitefunktionen ohne diese
              nicht funktionieren würden (z.&nbsp;B. die Warenkorbfunktion oder
              die Anzeige von Videos). Andere Cookies dienen dazu, das
              Nutzerverhalten auszuwerten&nbsp;oder Werbung anzuzeigen.
            </Text>
            &nbsp;
            <Text>
              Cookies, die zur Durchführung des elektronischen
              Kommunikationsvorgangs, zur Bereitstellung bestimmter, von Ihnen
              erwünschter Funktionen (z.&nbsp;B. für die Warenkorbfunktion) oder
              zur Optimierung der Website (z.&nbsp;B. Cookies zur Messung des
              Webpublikums) erforderlich sind (notwendige Cookies), werden auf
              Grundlage von Art. 6 Abs. 1 lit. f DSGVO gespeichert, sofern keine
              andere Rechtsgrundlage angegeben wird. Der Websitebetreiber hat
              ein berechtigtes Interesse an der Speicherung von notwendigen
              Cookies zur technisch fehlerfreien und optimierten Bereitstellung
              seiner Dienste. Sofern eine Einwilligung zur Speicherung von
              Cookies und vergleichbaren Wiedererkennungstechnologien abgefragt
              wurde, erfolgt die Verarbeitung ausschließlich auf Grundlage
              dieser Einwilligung (Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1
              TTDSG); die Einwilligung ist jederzeit widerrufbar.
            </Text>
            &nbsp;
            <Text>
              Sie können Ihren Browser so einstellen, dass Sie über das Setzen
              von Cookies informiert werden und Cookies nur im Einzelfall
              erlauben, die Annahme von Cookies für bestimmte Fälle oder
              generell ausschließen sowie das automatische Löschen der Cookies
              beim Schließen des Browsers aktivieren. Bei der Deaktivierung von
              Cookies kann die Funktionalität dieser Website eingeschränkt sein.
            </Text>
            &nbsp;
            <Text>
              Soweit Cookies von Drittunternehmen oder zu Analysezwecken
              eingesetzt werden, werden wir Sie hierüber im Rahmen dieser
              Datenschutzerklärung gesondert informieren und ggf. eine
              Einwilligung abfragen.
            </Text>
            <Heading size="lg" color="brand.500">
              Server-Log-Dateien
            </Heading>
            &nbsp;
            <Text>
              Der Provider der Seiten erhebt und speichert automatisch
              Informationen in so genannten Server-Log-Dateien, die Ihr Browser
              automatisch an uns übermittelt. Dies sind:
            </Text>
            &nbsp;
            <ul>
              &nbsp;
              <li>Browsertyp und Browserversion</li>{" "}
              <li>verwendetes Betriebssystem</li>&nbsp;
              <li>Referrer URL</li> <li>Hostname des zugreifenden Rechners</li>
              &nbsp;
              <li>Uhrzeit der Serveranfrage</li> <li>IP-Adresse</li>&nbsp;
            </ul>
            &nbsp;
            <Text>
              Eine Zusammenführung dieser Daten mit anderen Datenquellen wird
              nicht vorgenommen.
            </Text>
            &nbsp;
            <Text>
              Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1
              lit. f DSGVO. Der Websitebetreiber hat ein berechtigtes Interesse
              an der technisch fehlerfreien Darstellung und der Optimierung
              seiner Website – hierzu müssen die Server-Log-Files erfasst
              werden.
            </Text>
            <Heading size="lg" color="brand.500">
              Kontaktformular
            </Heading>
            &nbsp;
            <Text>
              Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden
              Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort
              angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für
              den Fall von Anschlussfragen bei uns gespeichert. Diese Daten
              geben wir nicht ohne Ihre Einwilligung weiter.
            </Text>
            &nbsp;
            <Text>
              Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6
              Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines
              Vertrags zusammenhängt oder zur Durchführung vorvertraglicher
              Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die
              Verarbeitung auf unserem berechtigten Interesse an der effektiven
              Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f
              DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)
              sofern diese abgefragt wurde; die Einwilligung ist jederzeit
              widerrufbar.
            </Text>
            &nbsp;
            <Text>
              Die von Ihnen im Kontaktformular eingegebenen Daten verbleiben bei
              uns, bis Sie uns zur Löschung auffordern, Ihre Einwilligung zur
              Speicherung widerrufen oder der Zweck für die Datenspeicherung
              entfällt (z.&nbsp;B. nach abgeschlossener Bearbeitung Ihrer
              Anfrage). Zwingende gesetzliche Bestimmungen – insbesondere
              Aufbewahrungsfristen – bleiben unberührt.
            </Text>
            <Heading size="lg" color="brand.500">
              Anfrage per E-Mail, Telefon oder Telefax
            </Heading>
            &nbsp;
            <Text>
              Wenn Sie uns per E-Mail, Telefon oder Telefax kontaktieren, wird
              Ihre Anfrage inklusive aller daraus hervorgehenden
              personenbezogenen Daten (Name, Anfrage) zum Zwecke der Bearbeitung
              Ihres Anliegens bei uns gespeichert und verarbeitet. Diese Daten
              geben wir nicht ohne Ihre Einwilligung weiter.
            </Text>
            &nbsp;
            <Text>
              Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6
              Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines
              Vertrags zusammenhängt oder zur Durchführung vorvertraglicher
              Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die
              Verarbeitung auf unserem berechtigten Interesse an der effektiven
              Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f
              DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)
              sofern diese abgefragt wurde; die Einwilligung ist jederzeit
              widerrufbar.
            </Text>
            &nbsp;
            <Text>
              Die von Ihnen an uns per Kontaktanfragen übersandten Daten
              verbleiben bei uns, bis Sie uns zur Löschung auffordern, Ihre
              Einwilligung zur Speicherung widerrufen oder der Zweck für die
              Datenspeicherung entfällt (z.&nbsp;B. nach abgeschlossener
              Bearbeitung Ihres Anliegens). Zwingende gesetzliche Bestimmungen –
              insbesondere gesetzliche Aufbewahrungsfristen – bleiben unberührt.
            </Text>
            <Heading size="lg" color="brand.500">
              Kommentar­funktion auf dieser Website
            </Heading>
            &nbsp;
            <Text>
              Für die Kommentarfunktion auf dieser Seite werden neben Ihrem
              Kommentar auch Angaben zum Zeitpunkt der Erstellung des
              Kommentars, Ihre E-Mail-Adresse und, wenn Sie nicht anonym posten,
              der von Ihnen gewählte Nutzername gespeichert.
            </Text>
            <Heading size="md" color="brand.500">
              Speicherdauer der Kommentare
            </Heading>
            &nbsp;
            <Text>
              Die Kommentare und die damit verbundenen Daten werden gespeichert
              und verbleiben auf dieser Website, bis der kommentierte Inhalt
              vollständig gelöscht wurde oder die Kommentare aus rechtlichen
              Gründen gelöscht werden müssen (z.&nbsp;B. beleidigende
              Kommentare).
            </Text>
            <Heading size="md" color="brand.500">
              Rechtsgrundlage
            </Heading>
            &nbsp;
            <Text>
              Die Speicherung der Kommentare erfolgt auf Grundlage Ihrer
              Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Sie können eine von
              Ihnen erteilte Einwilligung jederzeit widerrufen. Dazu reicht eine
              formlose Mitteilung per E-Mail an uns. Die Rechtmäßigkeit der
              bereits erfolgten Datenverarbeitungsvorgänge bleibt vom Widerruf
              unberührt.
            </Text>
            <Heading size="lg" color="brand.500">
              4. Soziale Medien
            </Heading>
            <Heading size="lg" color="brand.500">
              Twitter
            </Heading>
            &nbsp;
            <Text>
              Auf dieser Website sind Funktionen des Dienstes Twitter
              eingebunden. Diese Funktionen werden angeboten durch die Twitter
              International Company, One Cumberland Place, Fenian Street, Dublin
              2, D02 AX07, Irland.
            </Text>
            &nbsp;
            <Text>
              Wenn das Social-Media-Element aktiv ist, wird eine direkte
              Verbindung zwischen Ihrem Endgerät und dem Twitter-Server
              hergestellt. Twitter erhält dadurch Informationen über den Besuch
              dieser Website durch Sie. Durch das Benutzen von Twitter und der
              Funktion „Re-Tweet“ werden die von Ihnen besuchten Websites mit
              Ihrem Twitter-Account verknüpft und anderen Nutzern bekannt
              gegeben. Wir weisen darauf hin, dass wir als Anbieter der Seiten
              keine Kenntnis vom Inhalt der übermittelten Daten sowie deren
              Nutzung durch Twitter erhalten. Weitere Informationen hierzu
              finden Sie in der Datenschutzerklärung von Twitter unter:&nbsp;
              <a
                href="https://twitter.com/de/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://twitter.com/de/privacy
              </a>
              .
            </Text>
            &nbsp;
            <Text>
              Soweit eine Einwilligung (Consent) eingeholt wurde, erfolgt der
              Einsatz des o.&nbsp;g. Dienstes auf Grundlage von Art. 6 Abs. 1
              lit. a DSGVO und § 25 TTDSG. Die Einwilligung ist jederzeit
              widerrufbar. Soweit keine Einwilligung eingeholt wurde, erfolgt
              die Verwendung des Dienstes auf Grundlage unseres berechtigten
              Interesses an einer möglichst umfassenden Sichtbarkeit in den
              Sozialen Medien.
            </Text>
            &nbsp;
            <Text>
              Die Datenübertragung in die USA wird auf die
              Standardvertragsklauseln der EU-Kommission gestützt. Details
              finden Sie hier:&nbsp;
              <a
                href="https://gdpr.twitter.com/en/controller-to-controller-transfers.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://gdpr.twitter.com/en/controller-to-controller-transfers.html
              </a>
              .
            </Text>
            &nbsp;
            <Text>
              Ihre Datenschutzeinstellungen bei Twitter können Sie in den
              Konto-Einstellungen unter&nbsp;
              <a
                href="https://twitter.com/account/settings"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://twitter.com/account/settings
              </a>
              &nbsp; ändern.
            </Text>
            <Heading size="lg" color="brand.500">
              5. Plugins und Tools
            </Heading>
            <Heading size="lg" color="brand.500">
              YouTube
            </Heading>
            &nbsp;
            <Text>
              Diese Website bindet Videos der Website YouTube ein. Betreiber der
              Website ist die Google Ireland Limited („Google“), Gordon House,
              Barrow Street, Dublin 4, Irland.
            </Text>
            &nbsp;
            <Text>
              Wenn Sie eine unserer Webseiten besuchen, auf denen YouTube
              eingebunden ist, wird eine Verbindung zu den Servern von YouTube
              hergestellt. Dabei wird dem YouTube-Server mitgeteilt, welche
              unserer Seiten Sie besucht haben.
            </Text>
            &nbsp;
            <Text>
              Des Weiteren kann YouTube verschiedene Cookies auf Ihrem Endgerät
              speichern oder vergleichbare Technologien zur Wiedererkennung
              verwenden (z.&nbsp;B. Device-Fingerprinting). Auf diese Weise kann
              YouTube Informationen über Besucher dieser Website erhalten. Diese
              Informationen werden u.&nbsp;a. verwendet, um Videostatistiken zu
              erfassen, die Anwenderfreundlichkeit zu verbessern und
              Betrugsversuchen vorzubeugen.
            </Text>
            &nbsp;
            <Text>
              Wenn Sie in Ihrem YouTube-Account eingeloggt sind, ermöglichen Sie
              YouTube, Ihr Surfverhalten direkt Ihrem persönlichen Profil
              zuzuordnen. Dies können Sie verhindern, indem Sie sich aus Ihrem
              YouTube-Account ausloggen.
            </Text>
            &nbsp;
            <Text>
              Die Nutzung von YouTube erfolgt im Interesse einer ansprechenden
              Darstellung unserer Online-Angebote. Dies stellt ein berechtigtes
              Interesse im Sinne von Art. 6 Abs. 1 lit. f DSGVO dar. Sofern eine
              entsprechende Einwilligung abgefragt wurde, erfolgt die
              Verarbeitung ausschließlich auf Grundlage von Art. 6 Abs. 1 lit. a
              DSGVO und § 25 Abs. 1 TTDSG, soweit die Einwilligung die
              Speicherung von Cookies oder den Zugriff auf Informationen im
              Endgerät des Nutzers (z.&nbsp;B. Device-Fingerprinting) im Sinne
              des TTDSG umfasst. Die Einwilligung ist jederzeit widerrufbar.
            </Text>
            &nbsp;
            <Text>
              Weitere Informationen zum Umgang mit Nutzerdaten finden Sie in der
              Datenschutzerklärung von YouTube unter:&nbsp;
              <a
                href="https://policies.google.com/privacy?hl=de"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://policies.google.com/privacy?hl=de
              </a>
              .
            </Text>
            <Heading size="lg" color="brand.500">
              Google Fonts (lokales Hosting)
            </Heading>
            &nbsp;
            <Text>
              Diese Seite nutzt zur einheitlichen Darstellung von Schriftarten
              so genannte Google Fonts, die von Google bereitgestellt werden.
              Die Google Fonts sind lokal installiert. Eine Verbindung zu
              Servern von Google findet dabei nicht statt.
            </Text>
            &nbsp;
            <Text>
              Weitere Informationen zu Google Fonts finden Sie unter&nbsp;
              <a
                href="https://developers.google.com/fonts/faq"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://developers.google.com/fonts/faq
              </a>
              &nbsp; und in der Datenschutzerklärung von Google:&nbsp;
              <a
                href="https://policies.google.com/privacy?hl=de"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://policies.google.com/privacy?hl=de
              </a>
              .
            </Text>
            <Heading size="lg" color="brand.500">
              Font Awesome (lokales Hosting)
            </Heading>
            &nbsp;
            <Text>
              Diese Seite nutzt zur einheitlichen Darstellung von Schriftarten
              Font Awesome. Font Awesome ist lokal installiert. Eine Verbindung
              zu Servern von Fonticons, Inc. findet dabei nicht statt.
            </Text>
            &nbsp;
            <Text>
              Weitere Informationen zu Font Awesome finden Sie in der
              Datenschutzerklärung für Font Awesome unter:&nbsp;
              <a
                href="https://fontawesome.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://fontawesome.com/privacy
              </a>
              .
            </Text>
            <Text>
              Quelle:&nbsp;
              <a href="https://www.e-recht24.de">https://www.e-recht24.de</a>
            </Text>
          </>
        </Stack>
      </Flex>
    </>
  );
}
