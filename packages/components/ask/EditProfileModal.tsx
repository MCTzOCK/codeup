/**
 * packages/components/ask/EditProfileModal.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.06.23
 *
 */
import { IAskProfile } from "@codeup/web/src/types/IAskProfile";
import React from "react";
import CodeUpModal from "../codeup/CodeUpModal";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { FaGlobe, FaLink, FaSave } from "react-icons/fa";
import PopupManager from "@codeup/web/src/global/PopupManager";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import { useRouter } from "next/router";

export default function EditProfileModal(props: {
  onOpen: () => void;
  isOpen: boolean;
  onClose: () => void;
  profile: IAskProfile;
}) {
  const router = useRouter();
  const [banner, setBanner] = React.useState<string>(props.profile.banner);
  const [certificates, setCertificates] = React.useState<any[]>([]);
  const [activeCerts, setActiveCerts] = React.useState<string[]>([]);
  const [projects, setProjects] = React.useState<any[]>([]);
  const [activeProjcts, setActiveProjects] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (props.isOpen) {
      setBanner(props.profile.banner);
      setActiveCerts(props.profile.certificates);
      setActiveProjects(props.profile.projects);
      REST.Certificates.getObtainedCertificates(
        AccountManager.getActiveToken()
      ).then((res) => {
        if (res.status === 200) {
          setCertificates(res.payload.certs);
        }
      });
      REST.Editor.getProjectsV2(AccountManager.getActiveToken()).then((res) => {
        if (res.status === 200) {
          setProjects(
            res.payload.projects.filter(
              (p: any) => !p.customDomain.startsWith("disabled:")
            )
          );
        }
      });
    }
  }, [props.isOpen]);

  return (
    <>
      <CodeUpModal
        onOpen={props.onOpen}
        onClose={props.onClose}
        isOpen={props.isOpen}
        title={"Profil bearbeiten"}
        customSize={["full", "2xl"]}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            const data = new FormData(e.target as HTMLFormElement);
            let website = data.get("website") as string;
            let bio = data.get("bio") as string;
            let bannerUrl = banner;

            let update: {
              [key: string]: any;
            } = {
              certificates: activeCerts,
              projects: activeProjcts,
            };

            if (bannerUrl !== props.profile.banner) {
              update["banner"] = bannerUrl;
            }

            if (website.length > 0) {
              update["website"] = website;
            } else {
              update["website"] = "codeup.remove()";
            }

            if (bio.length > 0) {
              update["bio"] = bio;
            } else {
              update["bio"] = "codeup.remove()";
            }

            const res = await REST.Ask.updateProfile(
              props.profile.username,
              AccountManager.getActiveToken(),
              update
            );

            if (res.status === 200) {
              router.reload();
            } else {
              await PopupManager.alertAsync({
                title: "Fehler",
                description: "Dein Profil konnte nicht aktualisiert werden.",
              });
            }
          }}
        >
          <Stack gap={4}>
            <FormControl>
              <FormLabel>Webseite</FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <FaLink />
                </InputLeftElement>
                <Input
                  type={"url"}
                  name={"website"}
                  placeholder={"https://my.codeup.space"}
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel>Biography</FormLabel>
              <Textarea
                name={"bio"}
                placeholder={"Erzähle etwas über dich"}
                maxLength={250}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Banner</FormLabel>
              <Image
                src={banner}
                w={"100%"}
                h={[312, 624]}
                maxHeight={[250, 450]}
                maxW={"100vw"}
                objectFit={"cover"}
                borderRadius={"12px"}
                borderTopRadius={0}
                alt={"Banner"}
                shadow={"lg"}
                cursor={"pointer"}
                onClick={async () => {
                  const imageFL = await PopupManager.uploadFileAsync({
                    title: "Banner hochladen",
                    helperText: "Lade ein neues Banner hoch",
                  });

                  if (!imageFL || !imageFL.item(0)) return;

                  const form = document.createElement("form");

                  const input = document.createElement("input");
                  input.type = "file";
                  input.name = "file";
                  input.files = imageFL;

                  form.appendChild(input);

                  const formData = new FormData(form);

                  const r = await fetch("/media/upload", {
                    method: "POST",
                    body: formData,
                  });

                  if (r.status === 200) {
                    const data = await r.json();
                    setBanner(data.data.url);
                  } else {
                    await PopupManager.alertAsync({
                      title: "Fehler",
                      description:
                        "Beim Upload ist ein Fehler aufgetreten. Bitte versuche es erneut.",
                    });
                  }
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Zertifikate</FormLabel>
              <CheckboxGroup
                colorScheme={"blue"}
                value={activeCerts}
                onChange={(e) => {
                  setActiveCerts(e as string[]);
                }}
              >
                {certificates.map((cert) => {
                  return (
                    <>
                      <Checkbox value={cert._id}>{cert.course}</Checkbox>
                    </>
                  );
                })}
              </CheckboxGroup>
            </FormControl>
            <FormControl>
              <FormLabel>Projekte</FormLabel>
              <CheckboxGroup
                colorScheme={"blue"}
                value={activeProjcts}
                onChange={(e) => {
                  setActiveProjects(e as string[]);
                }}
              >
                {projects.map((proj) => {
                  return (
                    <>
                      <Checkbox mr={4} value={proj._id}>{proj.name}</Checkbox>
                    </>
                  );
                })}
              </CheckboxGroup>
            </FormControl>
            <Button leftIcon={<FaSave />} colorScheme={"green"} type={"submit"}>
              Speichern
            </Button>
          </Stack>
        </form>
      </CodeUpModal>
    </>
  );
}
