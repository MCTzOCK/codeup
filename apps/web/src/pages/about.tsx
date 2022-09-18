/**
 * src/pages/about.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.09.2022
 *
 */

import { Flex, Heading, Link, SimpleGrid } from "@chakra-ui/react";

export default function About() {
  return (
    <>
      <Flex
        mt="4rem"
        w={"100%"}
        gap="2rem"
        direction={"column"}
        textAlign={"center"}
        paddingInline={["1rem", "30%"]}
      >
        <Heading size={"xl"} fontFamily={"monospace"} color={"gray.200"}>
          Über CodeUp
        </Heading>

        <Heading size={"md"} fontFamily={"monospace"} color={"gray.200"}>
          CodeUp ist eine Platform, die dir mittels <b>interaktiven Kursen</b>,
          einer <b>fortschrittlichen Entwicklungsumgebung</b>, einer&nbsp;
          <b>Community</b> aus Gleichgesinnten und erfahrenen Entwicklern hilft,
          dich in der Welt der Programmierung zurechtzufinden. CodeUp wurde von
          Ben Siebert für Jugend Forscht 2023 entwickelt und ist komplett Open
          Source. Du kannst den Code von CodeUp auf&nbsp;
          <Link
            href="//github.com/MCTzOCK/CodeUp"
            target={"_blank"}
            color={"blue.500"}
          >
            GitHub
          </Link>
          &nbsp;finden.
        </Heading>
      </Flex>
      <Flex
        mt="4rem"
        mb="4rem"
        w={"100%"}
        gap="2rem"
        direction={"column"}
        textAlign={"center"}
        paddingInline={[0, "30%"]}
      >
        <Heading size={"xl"} fontFamily={"monospace"} color={"gray.200"}>
          Verwendete Technologien
        </Heading>

        <SimpleGrid columns={[2, 4]} spacing="40px">
          <TechListItem
            name={"Next.js"}
            icon={
              "https://camo.githubusercontent.com/f21f1fa29dfe5e1d0772b0efe2f43eca2f6dc14f2fede8d9cbef4a3a8210c91d/68747470733a2f2f6173736574732e76657263656c2e636f6d2f696d6167652f75706c6f61642f76313636323133303535392f6e6578746a732f49636f6e5f6c696768745f6261636b67726f756e642e706e67"
            }
          />
          <TechListItem
            name={"React"}
            icon={
              "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png?20220125121207"
            }
          />
          <TechListItem
            name={"Chakra UI"}
            icon={"https://avatars.githubusercontent.com/u/54212428?s=280&v=4"}
          />
          <TechListItem
            name={"MDX"}
            icon={"https://avatars.githubusercontent.com/u/37453691?s=280&v=4"}
          />
          <TechListItem
            name={"Remotion"}
            icon={"https://www.remotion.dev/img/logo-small.png"}
          />
          <TechListItem
            name={"TipTap"}
            icon={"/_static/vectors/tech/tiptap.svg"}
          />
          <TechListItem name={"JWT"} icon={"https://jwt.io/img/pic_logo.svg"} />
          <TechListItem
            name={"MongoDB"}
            icon={
              "https://colmenaenlanube.es/wp-content/uploads/2021/04/mongodb-compass.png"
            }
          />
          <TechListItem
            name={"Monaco Editor"}
            icon={"https://code.visualstudio.com/assets/images/code-stable.png"}
          />
          <TechListItem
            name={"nodemailer"}
            icon={
              "https://repository-images.githubusercontent.com/1272424/d1995000-0ab7-11ea-8ed3-04a082c36b0d"
            }
          />
          <TechListItem
            name={"TypeScript"}
            icon={
              "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/512px-Typescript_logo_2020.svg.png"
            }
          />
          <TechListItem
            name={"ESLint"}
            icon={
              "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/ESLint_logo.svg/1200px-ESLint_logo.svg.png"
            }
          />
          <TechListItem
            name={"Prettier"}
            icon={
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAA9lBMVEUaKzQzRlBWs7T7v0fqXl7Gk8YvQkz/xUgTGSUfMDkrPUdUrq/+wUf/x0gAGjMPJzTXpUNZursAJzEAHjNOoaNYTje3j0D0YWEAIygTFyQ7O0yZdZ3NmM0VHyoiND1FjZAjQUgPJy5/ZIVgUWvRV1gAITMAFjP0ukYYJS/IVFaffz14ZDpxPEI7d3swX2OVRklSNTyrTE8nS1GqgKy8jb7lsUXhXFxKl5o4b3QuWV8zOTUqNDVpXDlGRDY7Mjq2jkDKnkKDbzxpO0HfrUW7UlRIRVkpMj9BMjpQSjcyMDheOT+jSk2EQ0emhT90X39USmGUeD1uYDpa0JZDAAAKWklEQVR4nO2dCVfaShTHKai8aGgEEVuxQFgeWHdZRMQKiqhVAb//l3nQmlmyzZ1sxb77Oz09PacQ8s9MZrtbLIYgCIIgCIIgCIIgCPLRaXz7JzK+Nf6APqV7kY2M4jknsbC+5oX1gozA84t4pHS/kd9W1j55ZV0BKywU09EqTNNWXPcscC4R3ISX2WgFxuNFoxELPgR+WoM2YuM4aoHxbCAKP8EVbkStMJg2BCuMlSIeaOLpS+M9VCJ5DxcvYqRDTbpIp4uC97EU/Br+asXiRjoq4tlj9tY8t6LEZLFgvqT5+nX+56vgb8BHRH//kTUNgiAIEgy6M+aPaqERor6nUxce+M/2HrdD4rHH/5LihpQ+5XbU2XFkpXryRD97dTCop5JhkEq2c33mxgWrHalN/ktnZ8WNnTP62VldTYSFqrb7VKBoxSqxLn0YuepbcJv5/VHtcTM8gQuNOdJRxetV8N4ic9gRKjwzFA7rYQpMqPVtY7gBLL6hjZg5FApcGb0rrM1CFZhIhKJQ/1kVKjwx2vCtHW4v3bw2FIp7qcSLeCLQt1Ml11Ju1BAlqokhuSlFqFBiMP3x3FlxHE13VjrVUzLra9e59nzMC4d6+7VHZ33B9n8Nfogx76ex25MzR55fnjL0s5py8JoLh5vv/Ri7rFHW3ZCb8mN6xg3+s1ptKyRqYS7bEARBEN80vvnDdMirf4GgO95DI+hD44ZyfFT0xRFvua6U8wAmY0Zjo9B1vFzBbsaXsnKXin7taxvZLr2ncb61KmZvtdW8JxIb5xcb3OWY+3NYg0us2pQjn/p+USLXKwP0/aZJll4Fs4WPtqKjjRHcisFYudOG1VO/b4IVrk7eG7HRNfeiC8OI6nyaEbWVO/vPu8IpXOBq/sv7PVi60QZR6Ly9iNjKbTx0fQp5C98pE4Xme8gGqTAQK3eaDDW7+T2owNbU6KXnpjclfSR2SJEYao43fFu50xf0gVZaUIlleg98N01nS+R/nF7ENYn5Qrn0aeWOZ49KzOWm+daemNVmZUy/VDi+iDOXO2dur2DbilIT4vwiJZ/wr8R4F8LY+R5Mb5jvU/0FvtZJwSyyGpZ/IAiCIMtEdIZ2F3cBmBOBR7Zz9ZSY+qDPfgnoVsgdvz+97K8429OtBvb9Q0cvP5lj/YXJDGRQUutD2opgn0J2/Xjmbk63sQs901Y0bYXhxjXtegA1mKl3j4ZEsfHL+rQzh7IC5/w0JFpW4OC9hXYAt1zXZzXZJvxE93GZfXmBxMBuc5oBbURtCBaYSLx6UWh000zVg8L9ABT24Zbr+tCDQvLCZEYeFD47KoS/iFe5JFCgukmcQSSCXcj7op96eA9/kPs0P1T4BnE+1CQglutE4m6bMUKDBdJHnXmR1de5pfZZ00OVsXJryjC3KWYwu+Km/HVITBa/Fc+cPu9LMHp+4AzQTBSY5BY/Vtv6LGarJr6QCHdzusjAjiAIgvxRdIhdOojtqKbVZAjOSWo6KYuZTBVOY8HW+mw2RnMzs3Y9nH2HMzvocRoV+osFqUPvcbm5CjE0tPK7VCI0rI71IdTeNusyzoqJ9oBZJyrr7LJNxjAjYZbO0ycH31yQW9F6sm7wqnp35fiLYIkyZulWxWhEiQhessupvUI3MYxGsue2nAutgRVWwAKp0dbTDvhfDy7U6uCz4zMF+3lLKTTa0IvCz3deFG75VyjTS6e+eunMQy8lpwreT6JisQnYt4AxS3sYaWJXd0m5VlSTA9pQ5ocqMZiOJ02YWbrMmG35sdulBZkb0bZzbVUiFCrRvnlkJkRurJHcAu9OK2Km9/yXlAIE7mXRev0DCd62rzSnX5Q1c0dmRFieiEQEQRBEFudTWG3rX2c+82fEgWV9Czz9ia687HcM9g9jzLynvQ3adUcGB0ywWSN2fLERDBeX3P3Z2dOlNsD6zyprE9oZ0QD8q1zKxQCuqqkBifkMNClaukgFOHpfwlc1TyPe6LVzYnxXG6YES+PkjFymG2QqJuqQG4AHrX5rjuWuGo1YE27o1DtiUQw261uWJMvy78luE8ttKNwSW/jrhkIl2JxoQXqy//1t+Pe/h/+DsdTHfDj8GPNhzPuaht+hLu+aBkEQBAmEBgTTd3SIg5P5jDUKp247SpfHYi7P+S+d3h6K+clle9PHbofr013+B+Bn6SIK3QtIdB4fg/fjpApxSu+MDmm2N/0+33Kxp7fylZDytVnCjB05ol86A/pP7nQOyXfGTffYy71WhQoUGn7gEiWSzmeNLM7WLZezRLKS1yei4NK9POmoAeZrk4p0PnrfmGaeoQJXVjqGu/0XsSm2RZIQCAXKxHLDBcaNAOQMtJMuIAoBlthQFJrjqF3YODYUAhL1GewbvfRLWdhLmxK9FOyLYY6jdqNIE7eNwApfyA+NhVHezEgjVCgxmJaOsnHxZDGfLYolMuvrD2cd0GzB5gbVp03X2aI5YaO7Bfna5LbAl90jMd1LhVnW6Mrhy4mYl1P2d/TdipvjHG9GV9wc52St3KBFm3nZBvNFNy3FXLwgw122IQiCIL5hh3B+yNYgEVEy/JEcnroyyTcN8hX2v7T+DSCqTYbB6yMnMYqqZPouv6vJM0un7/XAc+om6sMtcn0fxYIk3EvHpsROexPSgm8i65oX1BQ1WEVSDcmanItsYWrhZGBXc86ezRKAzWs2ft6GQoCV25PCO2fvdBngCs1t2CJt6MH1HKLQxTs9DIWWBGt7xNlZm4XxHiZSbyQzQzRVyUwJ1vaadJvWG0i6ngNQUzkPEeFWpKqS3TMJ1lpl9uS5N7tTAWlPJFA3h6zzdlRVyZytB5J+2ei8jSAIgnxgYAlHrQDyjIaFlD5g0lgbQ0OZPYf3tciUX9PIbPLhiX/NsGtYH0XEPSFhmtkVWNddJZZJd4m0BRfA9/iW/aEMLXKoE7XAkGK5rXwEhTJJ1C00icKIX0OZDaICzxphhZ6u+juR8AB8pNF3F55KnvS12OjuiIcaqapkCqyoiIXylO8MgGwugSHpyQ4rDCMsFYMgCIL81TRsypKZPKDsSld+mKKT9lXJumxpMC3W/35jLRy6zV0n0hlfZpPvUJWMLQ2m9V7bNpnW6u0ZTTYGTdIeEDK1ZJ2rktFWHCZsbVBq4oBGWEapb0EQVcmMSmPatZO5Wx2QRlze3ZOLn/fGe6UxbdvR3E1iuZd4B+ziq5+lCp3asP0BFMYcq5LR0mC9nIPC5A3ppct7EuUYM8OWBuvbFohQk0wO88hPEyXmi8KxTVUyvjSY0s+1kyk+m1oq2c6xNT2W+ER43lHPrZT4S/Qety1c8wlUl/dUf4HVa90cbogWeQRBkP87wHoaVv70jUN5eO5I1AqjVF+emKtEvKaRmfNvqx5q+PyCzUe0xOvSHyOvAhc5pchllndvIRF4bkOV9NOoBcL3hzb52iTokIpTy6tQv636ULhP2nB5z2liT9JVCSk7NFA78rM2iXxtD16q9v3mmZkuorZyy+VrG1W9cHbLXcdjkFb4kV0x72satHIjCIIgCIIgCIIgCILI8x/INPTVzXECQQAAAABJRU5ErkJggg=="
            }
          />
          <TechListItem
            name={"Prism"}
            icon={"https://prismjs.com/assets/logo.svg"}
          />
          <TechListItem
            name={"Jest"}
            icon={"https://nx.dev/documentation/shared/jest-logo.png"}
          />
          <TechListItem
            name={"react-icons"}
            icon={
              "data:image/png;base64,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"
            }
          />
          <TechListItem
            name={"Caprover"}
            icon={"https://caprover.com/img/logo.png"}
          />
          <TechListItem
            name={"GitHub"}
            icon={
              "https://pbs.twimg.com/profile_images/1414990564408262661/r6YemvF9_400x400.jpg"
            }
          />
          <TechListItem
            name={"Webstorm"}
            icon={
              "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/WebStorm_Icon.svg/1200px-WebStorm_Icon.svg.png"
            }
          />
          <TechListItem
            name={"GitKraken"}
            icon={
              "https://yt3.ggpht.com/ytc/AMLnZu_1xh8LDkCMpLKwHAvxDhIROsQp-_KBRR1pVrdc=s900-c-k-c0x00ffffff-no-rj"
            }
          />
          <TechListItem
            name={"Undraw"}
            icon={"https://undraw.co/apple-touch-icon.png"}
          />
          <TechListItem
            name={"Git"}
            icon={
              "https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png"
            }
          />
          <TechListItem
            name={"Turborepo"}
            icon={
              "https://seeklogo.com/images/T/turborepo-logo-D9CF2C830E-seeklogo.com.png"
            }
          />
          <TechListItem
            name={"Yarn"}
            icon={"https://avatars.githubusercontent.com/u/22247014?s=200&v=4"}
          />
          <TechListItem
            name={"Docker"}
            icon={
              "https://www.docker.com/wp-content/uploads/2022/03/vertical-logo-monochromatic.png"
            }
          />

          <TechListItem
            name={"InCode"}
            icon={"/_static/vectors/tech/incode.svg"}
          />
          <TechListItem
            name={"DiceBear"}
            icon={
              "https://camo.githubusercontent.com/ac918a0462f377851e54ba49534b13cbdfb64a778d9a2845a23c0df23c2cfa9c/68747470733a2f2f64696365626561722e636f6d2f6170692f6d616c652f736565642e7376673f6d6f6f643d6861707079"
            }
          />
          <TechListItem
            name={"Copilot"}
            icon={
              "https://github.githubassets.com/images/modules/site/copilot/copilot.webp"
            }
          />
        </SimpleGrid>
      </Flex>
    </>
  );
}

function TechListItem(props: { name: string; icon: string }) {
  return (
    <Flex
      gap="1rem"
      w={"100%"}
      direction={"column"}
      alignItems="center"
      justifyContent={"center"}
      textAlign="center"
    >
      <img src={props.icon} width={"64"} height={"64"} />
      <Heading size={"md"} fontFamily={"monospace"} color={"gray.200"}>
        {props.name}
      </Heading>
    </Flex>
  );
}
